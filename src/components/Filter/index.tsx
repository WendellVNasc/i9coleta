// BIBLIOTECAS REACT
import { Col, Dropdown, Row } from "antd"

// CSS
import './styles.css'

// CRIA MENU DE FILTROS
const menu = (list: any[], callback: any) => {
    return list.map((item, index) => {
        return { key: `${index + 1}`, label: item, onClick: () => callback(item) }
    })
}

// INTERFACE
interface FilterInterface {
    name: string,
    state: any,
    setState: any,
    list: any[]
}

const Filter = ( { name, state, setState, list } : FilterInterface ) => {

    return (
        <Dropdown menu={{ items: menu(list, setState) }} >
            <Row align={'middle'} className='filter-btn-card'>
                <Col style={{lineHeight: 1}}>{name}: {state}</Col>
            </Row>
        </Dropdown>
    )
}

export default Filter