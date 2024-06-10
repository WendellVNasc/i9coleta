// BIBLIOTECAS REACT
import { Col, Row, Typography } from 'antd'

// CSS
import './styles.css'

// INTERFACE
interface CardKPIInterface {
    title: string,
    icon: any,
    value: any
}

const CardKPI = ( { title, icon, value } : CardKPIInterface ) => {

    return (
        <div className='card-kpi-small'>
            <Row gutter={[12,12]}>
                <Col span={24}>
                    <Typography className='card-kpi-small-title'>{title}</Typography>
                </Col>
                <Col span={24}>
                    <Row justify={'space-between'}>
                        <Col><Typography className='card-kpi-small-value'>{value}</Typography></Col>
                        <Col>{icon}</Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )

}

export default CardKPI