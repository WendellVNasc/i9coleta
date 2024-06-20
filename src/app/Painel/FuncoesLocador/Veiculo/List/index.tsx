// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrEditButton, TableTrPassword, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";

const VeiculoList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Placa', dataIndex: 'PLATE', table: 'vehicle.PLATE', width: '160px', sorter: true, align: 'center', render: null },
        { title: 'Renavam', dataIndex: 'RENAVAM_CODE', table: 'vehicle.RENAVAM_CODE', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Marca', dataIndex: 'BRAND', table: 'vehicle.BRAND', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Modelo', dataIndex: 'MODEL', table: 'vehicle.MODEL', width: '200px', sorter: true, align: 'center', render: null },
        { title: 'Tipo de Veículo', dataIndex: 'VEHICLE_TYPE_NAME', table: 'vehicle_type.NAME', width: 'auto', minWidth: '200px', sorter: true, align: 'left', render: null },
        { title: 'Situação', dataIndex: 'STATUS_NAME', table: 'vehicle.STATUS', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Ações', dataIndex: null, width: '100px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrEditButton type={type} permission={permission} item={item} />
                <TableTrTrashButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecoverButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Veículos</Link> },
            { title: type === 'list' ? 'Lista' : 'Lixeira' },
        ]} options={
            <Row justify={'end'} gutter={[8,8]}>
                <TableNewButton type={type} permission={permission} />
                <TableTrashButton type={type} permission={permission} />
                <TableReturnButton type={type} permission={permission} />
            </Row>
        }>
            <Row gutter={[16,16]}>
                <Col md={24} xs={24}>
                    <CardItem>
                        <Table
                            column={column}
                            path={path}
                            type={type}
                            action={action}
                            useFilter={[ 
                                { type: 'search', name: 'VEHICLE_TYPE_ID', label: 'Tipo de Veículo', url: '/vehicle_type/select.php' },
                                { type: 'select', name: 'STATUS', label: 'Situação', items: [ { value: 'D', label: 'Disponível' },{ value: 'R', label: 'Reservado para entrega' },{ value: 'ET', label: 'En trânsito' } ] }
                            ]}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default VeiculoList;