// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row, Tag, Typography } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../services";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import Table from "../../../../components/Table";
import LoadItem from "../../../../components/LoadItem";
import SelectSearch from "../../../../components/SelectSearch";
import { TbMapPin, TbMapPinOff } from "react-icons/tb";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const EntregasPendentesList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);
    const [ loadMap, setLoadMap ] = useState(false);
    const [ coord, setCoord ] = useState<any>(null)
    const [ product, setProduct ] = useState<any[]>([])
    const [ driver, setDriver ] = useState<any>('')
    const [ vehicle, setVehicle ] = useState<any>('')

    const onProduct = (item:any) => {
        
        onLoadMap()

        var temp = product
        
        if ( temp.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ) {
            temp.splice(temp.indexOf(item), 1)
        } else {
            temp.push(item)
        }
        
        setProduct(temp)

        onLoadMap()

    }

    const onLoadMap = () => setLoadMap(!loadMap)

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Pedido', dataIndex: 'DATETIME_UPDATE_FORMAT', table: 'order_location.DATETIME_UPDATE', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Cliente', dataIndex: 'CLIENT_NAME', table: 'client.NAME', width: 'auto', minWidth: '300px', sorter: false, align: 'left', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography>Pedido: n° {item.ORDER_ID}</Typography>
                    <Typography>{item.CLIENT_NAME}</Typography>
                    <Typography style={{color: 'var(--color02)'}}>{item.ADDRESS}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Código Caçamba', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography style={{textAlign: 'center'}}>{item.CODE}</Typography>
                    <Typography style={{color: 'var(--color02)', textAlign: 'center'}}>Modelo {item.STATIONARY_BUCKET_TYPE_NAME}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Distância', dataIndex: 'DISTANCE_NAME', width: '180px', sorter: false, align: 'center', render: null },
        { title: 'Data Entrega', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag style={{textAlign: 'center'}}>{ item.DATETIME_DELIVERY ? `Agendado para ${item.DATETIME_DELIVERY_FORMAT}` : 'Aguardando agendamento' }</Tag>
                { item.DATETIME_DELIVERY ? <Tag color="green">{item.DRIVER_NAME} - {item.DRIVER_CNH}</Tag> : null }
                { item.DATETIME_DELIVERY ? <Tag color="red">{item.VEHICLE_PLATE} - {item.VEHICLE_TYPE_NAME}</Tag> : null }
            </Row>
        ) },
        { title: 'Ações', dataIndex: null, width: '100px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                { product.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ? <Col><TbMapPinOff onClick={() => onProduct(item)} size={18} className="actions-button"/></Col>
                : <Col><TbMapPin onClick={() => onProduct(item)} size={18} className="actions-button"/></Col>}
            </Row>
        ) },
    ]

    // CARREGA DADOS
    const load = () => {
        POST_API('/credential/search.php', { token: getToken(), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setCoord([ res.data.LATITUDE, res.data.LONGITUDE ])
            }
        }).catch(POST_CATCH)
    }

    const [ form ] = Form.useForm()

    const onSend = (values:any) => {

        values.PRODUCTS = product
        POST_API('/order_location/delivery.php', { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                form.resetFields()
                setProduct([])
                setAction(!action)
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH)

    }

    useEffect(() => load(), [])

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: 'Entregas Pendentes' }
        ]}>
            <Row gutter={[16,16]}>
                <Col xs={24} md={16}>
                    <CardItem>
                        { coord ? loadMap ?
                            <MapContainer center={[Number(coord[0]), Number(coord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                    <Popup> Minha empresa </Popup>
                                </CircleMarker>
                                { product.map((v, i) => (
                                    <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                        <Popup> {v.ADDRESS} </Popup>
                                    </CircleMarker>
                                )) }
                            </MapContainer>
                        : 
                            <MapContainer center={[Number(coord[0]), Number(coord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                    <Popup> Minha empresa </Popup>
                                </CircleMarker>
                                { product.map((v, i) => (
                                    <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                        <Popup> {v.ADDRESS} </Popup>
                                    </CircleMarker>
                                )) }
                            </MapContainer>
                        : <LoadItem type="alt" />}
                    </CardItem>
                </Col>
                <Col xs={24} md={8}>
                    <CardItem title={`Agendar entrega | ${product.length} selecionado(s)`}>
                        <Form layout="vertical" form={form} onFinish={onSend}>
                            <Form.Item label="Data e hora entrega" name="DATETIME_DELIVERY" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <Input type="date" min={new Date().toISOString().slice(0, 10)} />
                            </Form.Item>
                            <Form.Item label="Motorista" name="DRIVER_ID" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <SelectSearch placeholder="Nome - CNH" effect={driver} value={form.getFieldValue('DRIVER_ID')} url="/driver/select.php" change={(v:any) => form.setFieldValue('DRIVER_ID', v?.value)} />
                            </Form.Item>
                            <Form.Item label="Veiculo" name="VEHICLE_ID" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <SelectSearch placeholder="Placa - Tipo" effect={vehicle} value={form.getFieldValue('VEHICLE_ID')} url="/vehicle/select.php" change={(v:any) => form.setFieldValue('VEHICLE_ID', v?.value)} />
                            </Form.Item>
                            <Button htmlType="submit" type="primary" block disabled={!(product.length > 0)}>Agendar</Button>
                        </Form>
                    </CardItem>
                </Col>
                <Col md={24} xs={24}>
                    <CardItem>
                        <Table
                            column={column}
                            path={path}
                            type={type}
                            action={action}
                            defaultFilter={{ STATUS: 'EP' }}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default EntregasPendentesList;