// BIBLIOTECAS REACT
import { useRef } from "react"
import { Col, List, Row, Tag, Typography } from "antd";

// INTERFACE
interface GraphProdutosMaisPedidosInterface {
    filters?: any,
    height?: string
}

const GraphProdutosMaisPedidos = ( { filters, height } : GraphProdutosMaisPedidosInterface ) => {

    // REF GRAFICO
    const thisGraph = useRef<any>()

    // LISTA
    const list:any[] = [
        { title: '000001 • Modelo C3', value: 912 },
        { title: '000002 • Modelo C3', value: 500 },
        { title: '000003 • Modelo C5', value: 412 },
        { title: '000004 • Modelo C10', value: 302 },
        { title: '000005 • Modelo C3', value: 105 },
        { title: '000006 • Modelo C7', value: 25 },
    ]

    return (
        <div style={{height: height, overflow: 'hidden'}} ref={thisGraph}>
            <List 
                dataSource={list}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <Row justify={'space-between'} style={{width: '100%'}} align={'middle'}>
                            <Col><Typography style={{ fontSize: '1em', cursor: 'default' }}>{item.title}</Typography></Col>
                            <Col><Tag  color="var(--color04)">{item.value}</Tag></Col>
                        </Row>
                    </List.Item>
                )}
            />
        </div>
    )

}

export default GraphProdutosMaisPedidos