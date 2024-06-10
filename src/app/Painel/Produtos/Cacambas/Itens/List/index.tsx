// BIBLIOTECAS REACT
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Row } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../../components/PageDefault";
import CardItem from "../../../../../../components/CardItem";
import Table from "../../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrEditButton, TableTrQrCodeButton, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../../components/Table/buttons";

const CacambasItensList = ({ type, path, permission } : PageDefaultProps ) => {

    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Código', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: 'auto', sorter: true, align: 'left', render: null },
        { title: 'Situação', dataIndex: 'STATUS_NAME', table: 'stationary_bucket.STATUS', width: '200px', sorter: true, align: 'center', render: null },
        { title: 'Ações', dataIndex: null, width: '120px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrQrCodeButton type={type} permission={permission} item={item} />
                <TableTrEditButton type={type} permission={permission} item={item} />
                <TableTrTrashButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecoverButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to='/painel/cacambas'>Caçambas</Link> },
            { title: <Link to={ type === 'list' ? '#' : '..' }>Itens</Link> },
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
                            defaultFilter={{ STATIONARY_BUCKET_GROUP_ID: ID }}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default CacambasItensList;