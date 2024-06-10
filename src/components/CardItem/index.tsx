// BIBLIOTECAS REACT
import { Col, Row, Typography } from 'antd'

// CSS
import './styles.css'

// INTERFACE
interface CardItemInterface {
    title?: string,
    children: any,
}

const CardItem = ( { title, children } : CardItemInterface ) => {

    return (
        <div className='card-item'>
            <Row gutter={[12,12]}>
                { title ?
                    <Col span={24}>
                        <Typography className='card-item-title'>{title}</Typography>
                    </Col>
                : null }
                <Col span={24}>
                    {children}
                </Col>
            </Row>
        </div>
    )

}

export default CardItem