// BIBLIOTECA REACT
import { Col, Row } from "antd"

// ICONES
import { IoCartOutline, IoCashOutline } from "react-icons/io5"

// COMPONENTES
import CardItem from "../../../components/CardItem"
import GraphTotalUsuarios from "../../../components/Graphics/graphTotalUsuarios"
import GraphServicosMaisUsados from "../../../components/Graphics/graphServicosMaisUsados"
import CardKPISmall from "../../../components/CardKPISmall"
import { TbShoppingCart, TbShoppingCartCheck, TbShoppingCartPause, TbShoppingCartPin, TbShoppingCartSearch, TbTruckDelivery } from "react-icons/tb"

// INTERFACE
interface DashClienteInterface {
    filters: any
}

const DashCliente = ( { filters } : DashClienteInterface ) => {

    return (
        <Row gutter={[16,16]}>
            <Col md={5} xs={24}>
                <CardKPISmall title="Pedidos Realizados" icon={<TbShoppingCart className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={5} xs={24}>
                <CardKPISmall title="Entregas Pendentes" icon={<TbShoppingCartPause className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={5} xs={24}>
                <CardKPISmall title="Locadas" icon={<TbShoppingCartPin className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={5} xs={24}>
                <CardKPISmall title="Aguardando Retirada" icon={<TbShoppingCartCheck className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Em Trânsito" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={14} xs={24}>
                <CardItem title="Caçambas por mês">
                    <GraphTotalUsuarios filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={10} xs={24}>
                <CardItem title="Últimos Pedidos">
                    <GraphServicosMaisUsados filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashCliente