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
    let todayBeginScore = detail.dayScores[detail.dayScores.length - 1];

    console.log(`${eventDayNow}/${days}`);

    for (let day = eventDayNow; day <= days; ++day) {
        let todayScore = detail.scorePerNormalDay;
        let todayModel = predictModel.dayPeriod[rank];
        if (day === eventDayNow) {
            todayScore = (detail.scorePerNormalDay * eventDayNow) - todayBeginScore + detail.dayScores[0];
            //todayScore = detail.todayScore;
        }
        if (day === days) {
            todayScore = detail.lastDayScore;
            todayModel = predictModel.lastDayPeriod[rank];
        }

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
    console.log(pre);
    return {
        xAxis: {
            type: 'category',
            data: tss,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: genDataY(predictDetail.ranks[rank].scores),
                type: 'line',
                smooth: true,
                showSymbol: false,
            },
            {
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
            <div>
                <ReactECharts style={{height: '800px'}} option={getOption(event, predictDetail, predictModel, "100")}/>
            </div>
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