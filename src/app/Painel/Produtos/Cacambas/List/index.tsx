// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Carousel, Col, Image, Row, Typography } from "antd";

// SERVIÇOS
import { PageDefaultProps, verifyConfig } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrCartButton, TableTrEditButton, TableTrGalleryButton, TableTrQrCodeButton, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../components/Table/buttons";
import { TbArrowsRandom } from "react-icons/tb";

const CacambasList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Fotos', dataIndex: 'GALLERY', table: 'stationary_bucket_group.DATETIME_INSERT', width: '80px', sorter: true, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Carousel autoplay style={{width: '60px'}} arrows={ item.GALLERY.length > 1 } dots={ item.GALLERY.length > 1 }>
                    { item.GALLERY.map((v:any, i:any) => (
                        <div key={i}><Image preview={false} src={v.URL} width={'100%'} /></div>
                    )) }
                </Carousel>
            </Row>
        ) },
        { title: 'Locador', dataIndex: 'PROVIDER_NAME', table: 'credential.NAME', width: 'auto', minWidth: '300px', sorter: true, align: 'left', render: null, hide: !verifyConfig('lcd.list') },
        { title: 'Tipo Locação', dataIndex: 'TYPE_LOCAL_NAME', table: 'stationary_bucket_group.TYPE_LOCAL', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Preço Locação', dataIndex: 'PRICE_EXTERNAL', table: 'stationary_bucket_group.PRICE_EXTERNAL', width: '180px', sorter: true, align: 'left', render: (item:any) => (
            <div style={{width: '100%'}}>
                <Typography>Loc. Externa: <span style={{color: 'var(--color01)', float: 'right'}}>{item.PRICE_EXTERNAL_NAME}</span></Typography>
                <Typography>Loc. Interna: <span style={{color: 'var(--color01)', float: 'right'}}>{item.PRICE_INTERNAL_NAME}</span></Typography>
            </div>
        ) },
        { title: 'Dias Locação', dataIndex: 'DAYS_EXTERNAL', table: 'stationary_bucket_group.DAYS_EXTERNAL', width: '180px', sorter: true, align: 'left', render: (item:any) => (
            <div style={{width: '100%'}}>
                <Typography>Loc. Externa: <span style={{color: 'var(--color01)', float: 'right'}}>Até {item.DAYS_EXTERNAL} dias</span></Typography>
                <Typography>Loc. Interna: <span style={{color: 'var(--color01)', float: 'right'}}>Até {item.DAYS_INTERNAL} dias</span></Typography>
            </div>
        ) },
        { title: 'Modelo', dataIndex: 'STATIONARY_BUCKET_TYPE_NAME', table: 'stationary_bucket_type.NAME', width: '140px', sorter: true, align: 'center', render: null },
        { title: 'Tampa', dataIndex: 'TYPE_LID_NAME', table: 'stationary_bucket_group.TYPE_LID', width: '140px', sorter: true, align: 'center', render: null },
        { title: 'Cores', dataIndex: 'COLOR', table: 'stationary_bucket_group.COLOR', width: '140px', sorter: true, align: 'center', render: null },
        { title: 'Disponíveis', dataIndex: 'STOCK', table: 'stationary_bucket_group.COLOR', width: 'auto', minWidth: '140px', sorter: true, align: 'center', render: null },
        { title: 'Ações', dataIndex: null, width: '120px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrCartButton type={type} permission={permission} item={item} />
                <TableTrGalleryButton type={type} permission={permission} item={item} />
                <TableTrEditButton type={type} permission={permission} item={item} />
                <TableTrTrashButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecoverButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Caçambas</Link> },
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
                            useFilter={ verifyConfig('lcd.list') ? [
                                { type: 'search', name: 'CREDENTIAL_ID', label: 'Locador', url: '/provider/select.php' },
                                { type: 'search', name: 'STATIONARY_BUCKET_TYPE_ID', label: 'Modelo', url: '/stationary_bucket_type/select.php' },
                            ] : [ { type: 'search', name: 'STATIONARY_BUCKET_TYPE_ID', label: 'Modelo', url: '/stationary_bucket_type/select.php' } ]}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default CacambasList;