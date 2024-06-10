// BIBLIOTECAS REACT
import { useRef } from "react"
import { Col, List, Rate, Row, Typography } from "antd";

// INTERFACE
interface GraphMelhoresAvaliacoesInterface {
    filters?: any,
    height?: string
}

const GraphMelhoresAvaliacoes = ( { filters, height } : GraphMelhoresAvaliacoesInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    // LISTA
    const list:any[] = [
        { title: '000001 • Modelo C3', value: 5.0 },
        { title: '000002 • Modelo C3', value: 4.8 },
        { title: '000003 • Modelo C5', value: 4.2 },
        { title: '000004 • Modelo C10', value: 3.8 },
        { title: '000005 • Modelo C3', value: 3.5 },
        { title: '000006 • Modelo C7', value: 3.0 },
    ]

    return (
        <div style={{height: height, overflow: 'hidden'}} ref={thisGraph}>
            <List 
                dataSource={list}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <Row justify={'space-between'} style={{width: '100%'}} align={'middle'}>
                            <Col><Typography style={{ fontSize: '1em', cursor: 'default' }}>{item.title}</Typography></Col>
                            <Col><Rate style={{marginRight: 3}} allowHalf className="rate rate-small" disabled value={item.value} /> {Number(item.value).toFixed(1)}</Col>
                        </Row>
                    </List.Item>
                )}
            />
        </div>
    )

}

export default GraphMelhoresAvaliacoes