// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Tag, Typography } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrAcceptButton, TableTrCancelButton, TableTrEditButton, TableTrPassword, TableTrRecoverButton, TableTrRecuseButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";
import CardKPISmall from "../../../../../components/CardKPISmall";
import { TbShoppingCartX, TbShoppingCartCheck, TbShoppingCartOff, TbShoppingCartPause } from "react-icons/tb";

const PedidosList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Abertura', dataIndex: 'DATETIME_INSERT_FORMAT', table: 'order_location.DATETIME_INSERT', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Cliente', dataIndex: 'CLIENT_NAME', table: 'client.NAME', width: 'auto', minWidth: '300px', sorter: true, align: 'left', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography>{item.CLIENT_NAME}</Typography>
                    <Typography style={{color: 'var(--color02)'}}>{item.ADDRESS.STREET}, {item.ADDRESS.NUMB} - {item.ADDRESS.DISTRICT} - {item.ADDRESS.CITY_NAME} / {item.ADDRESS.STATE_ACRONYM}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Quantidade', dataIndex: 'QTDE', table: 'order_location.QTDE', width: '100px', sorter: true, align: 'center', render: null },
        { title: 'Valor Total', dataIndex: 'PRICE_TOTAL_NAME', table: '(order_location.PRICE*order_location.QTDE)', width: '160px', sorter: true, align: 'right', render: null },
        { title: 'Situação', dataIndex: 'STATUS_NAME', table: 'order_location.STATUS', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag color={item.STATUS_COLOR}>{item.STATUS_NAME}</Tag>
            </Row>
        ) },
        { title: 'Ações', dataIndex: null, width: '100px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrAcceptButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecuseButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
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
                            defaultFilter={{ TYPE_USER: 'PROVIDER_ID' }}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default PedidosList;