// BIBLIOTECAS REACT
import { useEffect, useRef } from "react"
import * as echarts from 'echarts';

// SERVIÇOS
import { cor3, cor4, cor5 } from "../../services";

// INTERFACE
interface GraphPedidosInterface {
    filters?: any,
    height?: string
}

const GraphPedidos = ( { filters, height } : GraphPedidosInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    useEffect(() => {

        const chart = thisGraph.current;
        const chartMain = echarts.init(chart)

        const option: any = {
            xAxis: { type: 'category', boundaryGap: false, data: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ] },
            yAxis: {type: 'value' },
            tooltip: { trigger: 'axis', position: function (pt:any) { return ['10%', '10%']; } },
            grid: { left: '0px', right: '20px', bottom: '10px', top: '20px', containLabel: true },
            dataZoom: [ { type: 'inside', start: 0, end: '100%' } ],
            lineStyle: { color: cor3, width: 2 },
            series: [
                { name: 'Total de pedidos', type: 'line', smooth: true, symbol: 'none', areaStyle: { 
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: cor4 },
                        { offset: 1, color: cor5 }
                    ]) 
                }, data: [ 1, 5, 10, 17, 12, 15, 20, 43, 23, 10, 0, 17 ] }
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

export default GraphPedidos