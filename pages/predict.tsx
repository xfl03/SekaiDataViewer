import {GetStaticProps} from "next";
import style from '../styles/predict.module.css';
import React from "react";
import dateFormat from "dateFormat";
import {getPredictDebug, getPredictModel, PredictDebug, PredictModel} from "../lib/predict";
import {EventInfo, getEvent} from "../lib/event";

function timeStampToString(timestamp: number, d: boolean): string {
    let date = new Date(timestamp);
    return d ? dateFormat(date, "mm/dd") : dateFormat(date, "HH:MM:ss");
}

function getPredictTable(predictDetail: PredictDebug) {
    let element: Array<JSX.Element> = [];
    let pre = undefined;
    for (let p in predictDetail.ranks) {
        if (pre === undefined) {
            pre = p;
            continue;
        }
        let pp = predictDetail.ranks[p];
        let prep = predictDetail.ranks[pre];
        element.push(<tr>
            <td><b>{pre}</b></td>
            <td>{prep.result}</td>
            <td>{Math.round(prep.result * 1.03)}</td>
            <td style={{paddingLeft:'120px'}}><b>{p}</b></td>
            <td>{pp.result}</td>
            <td>{Math.round(pp.result * 1.03)}</td>
        </tr>);
        pre = undefined;
    }
    return element;
}

export default function Predict(
    {
        event,
        predictDetail,
    }: {
        event: EventInfo,
        predictDetail: PredictDebug,
    }) {
    return (
        <div className={style.body}>
            <div className={style.event_info}>
                <div><img src={`/assets/event/${event.assetbundleName}.webp`} alt={"logo"}/></div>
                <div style={{fontSize: '100px', fontWeight: 'bolder', color: 'white'}}>{event.name}</div>
                <div
                    style={{fontSize: '63px'}}>活动结束时间：<b>{timeStampToString(event.aggregateAt, true)}</b> {timeStampToString(event.aggregateAt, false)}
                </div>
                <div style={{fontSize: '45px'}}>结活Live首映：{timeStampToString(event.aggregateAt, true)} 21:00 (均为北京时间)
                </div>
            </div>
            <div className={style.predict_summary}>
                <table>
                    <tr>
                        <th>排名</th>
                        <th>预测</th>
                        <th>预测+3%</th>
                        <th style={{paddingLeft:'120px'}}>排名</th>
                        <th>预测</th>
                        <th>预测+3%</th>
                    </tr>
                    {getPredictTable(predictDetail)}
                </table>
            </div>
            <div className={style.footer}>
                <div>bilibili @xfl03</div>
                <div>活动预测仅供参考，请时刻关注档线变化</div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const event = getEvent();
    const predictDetail = getPredictDebug();
    //console.log(predictDetail);
    //const model = getPredictModel(predictDetail.eventType);
    return {
        props: {
            event,
            predictDetail,
            //model,
        }
    }
}