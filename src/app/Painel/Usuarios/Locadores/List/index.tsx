// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Col, Row } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrEditButton, TableTrPassword, TableTrPhotoButton, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";

const LocadoresList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Logo', dataIndex: 'PHOTO', table: 'credential.PHOTO', width: '60px', sorter: false, align: 'center', render: (item:any) => <Row justify={'center'} style={{width: '100%'}}><Avatar src={item.PHOTO ? item.PHOTO : null} /></Row> },
        { title: 'Nome', dataIndex: 'NAME', table: 'credential.NAME', width: 'auto', sorter: true, align: 'left', render: null },
        { title: 'CPF/CNPJ', dataIndex: 'LOGIN', table: 'credential.LOGIN', width: '200px', sorter: true, align: 'center', render: null },
        { title: 'Cidade', dataIndex: 'CITY_NAME', table: 'city.NAME', width: '150px', sorter: true, align: 'center', render: null },
        { title: 'Estado', dataIndex: 'STATE_NAME', table: 'state.NAME', width: '100px', sorter: true, align: 'center', render: null },
        { title: 'Ações', dataIndex: null, width: '120px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrPhotoButton type={type} permission={permission} item={item} action={() => setAction(!action)}/>
                <TableTrEditButton type={type} permission={permission} item={item} />
                <TableTrTrashButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecoverButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrPassword type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Locadores</Link> },
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
                                { type: 'search', name: 'STATE_ID', label: 'Estado', url: '/state/select.php' },
                                { type: 'search', name: 'CITY_ID', label: 'Cidade', url: '/city/select.php' }
                            ]}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default LocadoresList;