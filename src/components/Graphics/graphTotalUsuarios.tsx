// BIBLIOTECAS REACT
import { useEffect, useRef } from "react"
import * as echarts from 'echarts';

// SERVIÇOS
import { cor3, cor4, cor5 } from "../../services";

// INTERFACE
interface GraphTotalUsuariosInterface {
    filters?: any,
    height?: string
}

const GraphTotalUsuarios = ( { filters, height } : GraphTotalUsuariosInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()
    
    useEffect(() => {
        
        // EIXO X LABEL
        const months:string[] = [ "Jan", 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ];
        
        const chart = thisGraph.current;
        const chartMain = echarts.init(chart)

        const option: any = {
            color: [ cor3, cor4, cor5 ],
            xAxis: { type: 'category', data: months },
            yAxis: { type: 'value'},
            tooltip: { trigger: 'axis', position: function (pt:any) { return ['10%', '10%']; }},
            grid: { left: '0px', right: '20px', bottom: '20px', top: '20px', containLabel: true },
            dataZoom: [ { type: 'inside', start: 0, end: '100%' } ],
            lineStyle: { color: cor3, width: 2 },
            series: [
                { name: 'Sistema', type: 'bar', stack: 'total', data: new Array(12).fill(Math.floor(Math.random()*100)) },
                { name: 'Locadores', type: 'bar', stack: 'total', data: new Array(12).fill(Math.floor(Math.random()*100))  },
                { name: 'Locatários', type: 'bar', stack: 'total', data: new Array(12).fill(Math.floor(Math.random()*100))  }
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

export default GraphTotalUsuarios