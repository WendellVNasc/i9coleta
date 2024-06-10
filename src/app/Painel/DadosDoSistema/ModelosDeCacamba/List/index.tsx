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
import { TableNewButton, TableReturnButton, TableTrEditButton, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";

const ModelosDeCacambaList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Foto', dataIndex: 'PHOTO', table: 'stationary_bucket_type.PHOTO', width: '100px', sorter: false, align: 'center', render: ( item:any ) => <img src={item.PHOTO} width='100%' /> },
        { title: 'Capacidade', dataIndex: 'M3_NAME', table: 'stationary_bucket_type.M3', width: '120px', sorter: true, align: 'center', render: null },
        { title: 'Modelo', dataIndex: 'NAME', table: 'stationary_bucket_type.NAME', width: 'auto', sorter: true, align: 'left', render: null },
        { title: 'A', dataIndex: 'LETTER_A_NAME', table: 'stationary_bucket_type.LETTER_A', width: '90px', sorter: true, align: 'center', render: null },
        { title: 'B', dataIndex: 'LETTER_B_NAME', table: 'stationary_bucket_type.LETTER_B', width: '90px', sorter: true, align: 'center', render: null },
        { title: 'C', dataIndex: 'LETTER_C_NAME', table: 'stationary_bucket_type.LETTER_C', width: '90px', sorter: true, align: 'center', render: null },
        { title: 'D', dataIndex: 'LETTER_D_NAME', table: 'stationary_bucket_type.LETTER_D', width: '90px', sorter: true, align: 'center', render: null },
        { title: 'E', dataIndex: 'LETTER_E_NAME', table: 'stationary_bucket_type.LETTER_E', width: '90px', sorter: true, align: 'center', render: null },
        { title: 'F', dataIndex: 'LETTER_F_NAME', table: 'stationary_bucket_type.LETTER_F', width: '90px', sorter: true, align: 'center', render: null },
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
            { title: <Link to={ type === 'list' ? '#' : '..' }>Modelos de Caçamba</Link> },
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
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default ModelosDeCacambaList;