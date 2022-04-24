import {GetStaticProps} from "next";
import style from '../styles/predict.module.css';
import React from "react";
import dateFormat from "dateFormat";
import {getPredictDebug, getPredictModel, PredictDebug, PredictModel} from "../lib/predict";
import {EventInfo, getEvent} from "../lib/event";
import ReactECharts from 'echarts-for-react';

function timeStampToString(timestamp: number, d: boolean): string {
    let date = new Date(timestamp);
    return d ? dateFormat(date, "mm/dd") : dateFormat(date, "HH:MM:ss");
}

function timeStampToStringFull(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "mm/dd HH:MM");
}

function genPredict(
    predictDetail: PredictDebug,
    predictModel: PredictModel,
    rank: string, length: number) {
    let ret = [];
    for (let i = 0; i < length; ++i) {
        ret.push('');
    }

    let eventDayNow = predictDetail.eventDayNow;
    let days = predictDetail.days;
    let startPos = 18 + (predictDetail.eventDayNow - 1) * 48;
    let detail = predictDetail.ranks[rank];
    let todayBeginScore = detail.dayScores[detail.lastDayEnd - 1];

    console.log(`${eventDayNow}/${days}`);

    for (let day = eventDayNow; day <= days; ++day) {
        let todayScore = 0;
        let todayModel = predictModel.dayPeriod[rank];
        if (day === days) {
            todayScore = detail.lastDayScore;
            todayModel = predictModel.lastDayPeriod[rank];
        } else if (day === eventDayNow) {
            todayScore = detail.todayScore;
        } else {
            let daysRemain = days - day;
            todayScore = (detail.scorePerNormalDay * (days - 1)) - todayBeginScore + detail.dayScores[0];
            console.log(`${todayScore} / ${daysRemain}`);
            todayScore /= daysRemain;
        }
        console.log(todayScore);

        todayModel.forEach((it, i) => {
            //if (day === eventDayNow)console.log(`${it} ${todayScore} ${todayBeginScore}`)
            ret[startPos + i] = Math.round(it * todayScore + todayBeginScore);
        })

        todayBeginScore = todayBeginScore + todayScore;
        startPos += 48;
    }

    return ret;
}

function genTimestamps(beginTime: number, length: number) {
    let ret = [];
    for (let i = 0; i < length; ++i) {
        ret.push(timeStampToStringFull(beginTime + 30 * 60 * 1000 * i));
    }
    return ret;
}

function genDataY(data: Array<number>) {
    return data.map((it, i) => i == 0 || it > 0 ? it : "")
}

function getOption(
    event: EventInfo,
    predictDetail: PredictDebug,
    predictModel: PredictModel,
    rank: string
) {
    let len = predictDetail.ranks[rank].scores.length;
    let tss = genTimestamps(event.startAt, len);
    let pre = genPredict(predictDetail, predictModel, rank, len);
    //console.log(pre);
    return {
        xAxis: {
            type: 'category',
            data: tss,
            axisLabel:{
                textStyle:{
                    fontSize:'30px'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel:{
                textStyle:{
                    fontSize:'30px'
                }
            }
        },
        series: [
            {
                name: '实际PT',
                data: genDataY(predictDetail.ranks[rank].scores),
                type: 'line',
                smooth: true,
                showSymbol: false,
            },
            {
                name: '预测PT',
                data: pre,
                type: 'line',
                smooth: true,
                showSymbol: false,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
    };
}

function getPredictElement(
    event: EventInfo,
    predictDetail: PredictDebug,
    predictModel: PredictModel,
    rank: string) {
    let pre = predictDetail.ranks[rank];
    return (
        <div className={style.predict_detail}>
            <ReactECharts style={{height: '600px',marginLeft:'70px'}} option={getOption(event, predictDetail, predictModel, rank)}/>
            <table>
                <tr>
                    <th>排名</th>
                    {pre.dayScores[0]?<th>首日</th>:<p></p>}
                    <th>今日 (预测)</th>
                    <th>平日 (预测)</th>
                    <th>终日 (预测)</th>
                    <th>最终 (预测)</th>
                </tr>
                <tr>
                    <td><b>{rank}</b></td>
                    {pre.dayScores[0]?<td>{pre.dayScores[0]}</td>:<p></p>}
                    <td>{pre.todayScore}</td>
                    <td>{Math.round(pre.scorePerNormalDay)}</td>
                    <td>{Math.round(pre.lastDayScore)}</td>
                    <td>{pre.result}</td>
                </tr>
            </table>
            <div className={style.footer} style={{marginBottom:'130px'}}>
                <div>bilibili @xfl03 &nbsp;&nbsp;&nbsp; 活动预测仅供参考，请时刻关注档线变化</div>
            </div>
        </div>
    );
}

export default function PredictScore(
    {
        event,
        predictDetail,
        predictModel,
    }: {
        event: EventInfo,
        predictDetail: PredictDebug,
        predictModel: PredictModel,
    }) {
    return (
        <div className={style.body}>
            {getPredictElement(event, predictDetail, predictModel, "1000")}
            {getPredictElement(event, predictDetail, predictModel, "5000")}
            {getPredictElement(event, predictDetail, predictModel, "10000")}
        </div>

    );
}

export const getStaticProps: GetStaticProps = async () => {
    const event = getEvent();
    const predictDetail = getPredictDebug();
    //console.log(predictDetail);
    const predictModel = getPredictModel(predictDetail.eventType);
    return {
        props: {
            event,
            predictDetail,
            predictModel,
        }
    }
}