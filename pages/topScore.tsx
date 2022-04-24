import {GetStaticProps} from "next";
import style from '../styles/predict.module.css';
import React from "react";
import dateFormat from "dateFormat";
import {getPredictDebug, getPredictModel, getTopScores, PredictDebug, PredictModel, TopScores} from "../lib/predict";
import {EventInfo, getEvent} from "../lib/event";
import ReactECharts from 'echarts-for-react';

function timeStampToStringFull(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "mm/dd HH:MM");
}

function genTimestamps(beginTime: number, length: number) {
    let ret = [];
    for (let i = 0; i < length; ++i) {
        ret.push(timeStampToStringFull(beginTime + 30 * 60 * 1000 * i));
    }
    return ret;
}

function getOption(
    event: EventInfo,
    topScores: TopScores
) {
    let tss = genTimestamps(event.startAt, topScores.days * 48 + 12);
    let ses = [];
    for (let i = 1; i <= 10; ++i) {
        let data = topScores.tops[i-1];
        ses.push({
            name: `T${i} - ${data.name}`,
            data: data.pts,
            type: 'line',
            smooth: true,
            showSymbol: false,
        });
    }
    //console.log(pre);
    return {
        xAxis: {
            type: 'category',
            data: tss,
            axisLabel: {
                textStyle: {
                    fontSize: '30px'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                    fontSize: '30px'
                }
            }
        },
        series: ses,
        tooltip: {
            trigger: 'axis',
        },
    };
}

export default function PredictScore(
    {
        event,
        topScores
    }: {
        event: EventInfo,
        topScores: TopScores
    }) {
    return (
        <div className={style.body}>
            <ReactECharts style={{height: '600px', marginLeft: '70px'}} option={getOption(event, topScores)}/>
        </div>

    );
}

export const getStaticProps: GetStaticProps = async () => {
    const event = getEvent();
    const topScores = getTopScores();
    return {
        props: {
            event,
            topScores
        }
    }
}