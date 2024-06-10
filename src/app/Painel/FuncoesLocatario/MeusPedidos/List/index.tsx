// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Tag } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrCancelButton, TableTrEditButton, TableTrPassword, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";
import CardKPISmall from "../../../../../components/CardKPISmall";
import { TbShoppingCartX, TbShoppingCartCheck, TbShoppingCartOff, TbShoppingCartPause } from "react-icons/tb";

const MeusPedidosList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Abertura', dataIndex: 'DATETIME_INSERT_FORMAT', table: 'order_location.DATETIME_INSERT', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Realizado Por', dataIndex: 'CREDENTIAL_NAME', table: 'credential.NAME', width: '280px', sorter: true, align: 'center', render: null },
        { title: 'Locador', dataIndex: 'PROVIDER_NAME', table: 'provider.NAME', width: 'auto', minWidth: '300px', sorter: true, align: 'left', render: null },
        { title: 'Valor Total', dataIndex: 'PRICE_TOTAL_NAME', table: '(order_location.PRICE*order_location.QTDE)', width: '200px', sorter: true, align: 'right', render: null },
        { title: 'Situação', dataIndex: 'STATUS_NAME', table: 'order_location.STATUS', width: '200px', sorter: true, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag color={item.STATUS_COLOR}>{item.STATUS_NAME}</Tag>
            </Row>
        ) },
        { title: 'Ações', dataIndex: null, width: '100px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrCancelButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: 'Meus pedidos' }
        ]}>
            <Row gutter={[16,16]}>
                <Col xs={24} md={6}>
                    <CardKPISmall title="Aguardando confirmação" value={0} icon={<TbShoppingCartPause className="card-kpi-small-icon" />} />
                </Col>
                <Col xs={24} md={6}>
                    <CardKPISmall title="Pedidos aceitos" value={0} icon={<TbShoppingCartCheck className="card-kpi-small-icon" />} />
                </Col>
                <Col xs={24} md={6}>
                    <CardKPISmall title="Pedidos recusados" value={0} icon={<TbShoppingCartX className="card-kpi-small-icon" />} />
                </Col>
                <Col xs={24} md={6}>
                    <CardKPISmall title="Pedidos cancelados" value={0} icon={<TbShoppingCartOff className="card-kpi-small-icon" />} />
                </Col>
                <Col md={24} xs={24}>
                    <CardItem>
                        <Table
                            column={column}
                            path={path}
                            type={type}
                            action={action}
                            defaultFilter={{ TYPE_USER: 'CLIENT_ID' }}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default MeusPedidosList;