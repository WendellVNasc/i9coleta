// BIBLIOTECA REACT
import { Col, Row } from "antd"

// ICONES
import { TbShoppingCart, TbShoppingCartCheck, TbShoppingCartPause, TbShoppingCartPin, TbShoppingCartSearch, TbTruckDelivery } from "react-icons/tb"

// COMPONENTES
import CardItem from "../../../components/CardItem"
import GraphAvaliacoes from "../../../components/Graphics/graphAvaliacoes"
import GraphPedidos from "../../../components/Graphics/graphPedidos"
import GraphProdutosMaisPedidos from "../../../components/Graphics/graphProdutosMaisPedidos"
import GraphMelhoresAvaliacoes from "../../../components/Graphics/graphMelhoresAvaliacoes"
import GraphUltimosComentarios from "../../../components/Graphics/graphUltimosComentarios"
import CardKPISmall from "../../../components/CardKPISmall"

// INTERFACE
interface DashFornecedorInterface {
    filters: any
}

const DashFornecedor = ( { filters } : DashFornecedorInterface ) => {

    return (
        <Row gutter={[16,16]}>
            <Col md={4} xs={24}>
                <CardKPISmall title="Total Caçambas" icon={<TbShoppingCart className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Disponíveis" icon={<TbShoppingCartSearch className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Entregas Pendentes" icon={<TbShoppingCartPause className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Locadas" icon={<TbShoppingCartPin className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Aguardando Retirada" icon={<TbShoppingCartCheck className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Em Trânsito" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={16} xs={24}>
                <CardItem title="Pedidos por mês">
                    <GraphPedidos filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={8} xs={24}>
                <CardItem title="Avaliações">
                    <GraphAvaliacoes filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={7} xs={24}>
                <CardItem title="Produtos mais pedidos">
                    <GraphProdutosMaisPedidos filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={7} xs={24}>
                <CardItem title="Melhores avaliações">
                    <GraphMelhoresAvaliacoes filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={10} xs={24}>
                <CardItem title="Últimos comentários">
                    <GraphUltimosComentarios filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashFornecedor