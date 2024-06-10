// BIBLIOTECAS REACT
import { useEffect, useRef } from "react"

// SERVIÇO
import { Col, Progress, Rate, Row, Typography } from "antd";

// INTERFACE
interface GraphAvaliacoesInterface {
    filters?: any,
    height?: string
}

const GraphAvaliacoes = ( { filters, height } : GraphAvaliacoesInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    useEffect(() => { }, [filters])

    return (
        <Row justify={'center'} align={'middle'} style={{height: height}} gutter={[16,16]} ref={thisGraph}>
            <Col span={24}>
                <center><Typography className="rate-title">4.8</Typography></center>
                <center><Rate allowHalf disabled value={4.8} className="rate"/></center>
            </Col>
            <Col span={24}>
                <Row gutter={[8,8]} style={{flexWrap:'nowrap'}} align={'middle'}>
                    <Col flex={'8em'}><Rate className="rate rate-small" disabled value={5} /></Col>
                    <Col flex={'auto'}><Progress strokeColor="var(--color04)" strokeWidth={10} percent={30} showInfo={false} /></Col>
                    <Col flex={'3em'}>30</Col>
                </Row>
                <Row gutter={[8,8]} style={{flexWrap:'nowrap'}} align={'middle'}>
                    <Col flex={'8em'}><Rate className="rate rate-small" disabled value={4} /></Col>
                    <Col flex={'auto'}><Progress strokeColor="var(--color04)" strokeWidth={10} percent={40} showInfo={false} /></Col>
                    <Col flex={'3em'}>40</Col>
                </Row>
                <Row gutter={[8,8]} style={{flexWrap:'nowrap'}} align={'middle'}>
                    <Col flex={'8em'}><Rate className="rate rate-small" disabled value={3} /></Col>
                    <Col flex={'auto'}><Progress strokeColor="var(--color04)" strokeWidth={10} percent={15} showInfo={false} /></Col>
                    <Col flex={'3em'}>15</Col>
                </Row>
                <Row gutter={[8,8]} style={{flexWrap:'nowrap'}} align={'middle'}>
                    <Col flex={'8em'}><Rate className="rate rate-small" disabled value={2} /></Col>
                    <Col flex={'auto'}><Progress strokeColor="var(--color04)" strokeWidth={10} percent={10} showInfo={false} /></Col>
                    <Col flex={'3em'}>10</Col>
                </Row>
                <Row gutter={[8,8]} style={{flexWrap:'nowrap'}} align={'middle'}>
                    <Col flex={'8em'}><Rate className="rate rate-small" disabled value={1} /></Col>
                    <Col flex={'auto'}><Progress strokeColor="var(--color04)" strokeWidth={10} percent={5} showInfo={false} /></Col>
                    <Col flex={'3em'}>5</Col>
                </Row>
            </Col>
        </Row>
    )

}

export default GraphAvaliacoes