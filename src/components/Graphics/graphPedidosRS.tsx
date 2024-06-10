// BIBLIOTECAS REACT
import { useEffect, useRef } from "react"
import * as echarts from 'echarts';

// SERVIÇOS
import { cor3, cor4, cor5 } from "../../services";

// INTERFACE
interface GraphPedidosRSInterface {
    filters?: any,
    height?: string
}

const GraphPedidosRS = ( { filters, height } : GraphPedidosRSInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    useEffect(() => {

        const chart = thisGraph.current;
        const chartMain = echarts.init(chart)

        const option: any = {
            xAxis: { type: 'category', boundaryGap: false, data: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ] },
            yAxis: { type: 'value', axisLabel: { formatter: (v:any) => `R$ ${(v)?.toLocaleString('pt-BR')}` } },
            tooltip: { trigger: 'axis', position: function (pt:any) { return ['10%', '10%']; }, valueFormatter: (v:any) => `R$ ${(v)?.toLocaleString('pt-BR')}` },
            grid: { left: '10px', right: '20px', bottom: '10px', top: '20px', containLabel: true },
            dataZoom: [ { type: 'inside', start: 0, end: '100%' } ],
            lineStyle: { color: cor3, width: 2 },
            series: [
                { name: 'Valor Total', type: 'line', smooth: true, symbol: 'none', areaStyle: { 
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: cor4 },
                        { offset: 1, color: cor5 }
                    ]) 
                }, data: [ 10.30, 60.99, 150.20, 145.30, 20.66, 78.99, 10.50, 5.60, 76.93, 46.85, 0, 182.23 ] }
            ]
        }

        chartMain.setOption(option)

        setInterval(() => {
            chartMain.resize()
        }, 500);

    }, [filters])

    return (
        <div style={{height: height, overflow: 'hidden'}} ref={thisGraph}/>
    )

}

export default GraphPedidosRS