// BIBLIOTECA REACT
import { Col, Row } from "antd"

// COMPONENTES
import CardItem from "../../../components/CardItem"
import GraphTotalUsuarios from "../../../components/Graphics/graphTotalUsuarios"
import GraphServicosMaisUsados from "../../../components/Graphics/graphServicosMaisUsados"
import CardKPISmall from "../../../components/CardKPISmall"
import { TbTruckDelivery } from "react-icons/tb"
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet"
import { useEffect, useState } from "react"
import LoadItem from "../../../components/LoadItem"

// INTERFACE
interface DashMotoristaInterface {
    filters: any
}

const DashMotorista = ( { filters } : DashMotoristaInterface ) => {

    const [ coord, setCoord ] = useState<any>(null)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => setCoord([position.coords.latitude, position.coords.longitude]));
    })

    return (
        <Row gutter={[16,16]}>
            <Col md={4} xs={24}>
                <CardKPISmall title="Entregas Agendadas (hoje)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Entregas Agendadas (mês)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Entregas Agendadas (atrasadas)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Retiradas Agendadas (hoje)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Retiradas Agendadas (mês)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={4} xs={24}>
                <CardKPISmall title="Retiradas Agendadas (atrasadas)" icon={<TbTruckDelivery className="card-kpi-small-icon" />} value={10} />
            </Col>
            <Col md={10} xs={24}>
                <CardItem title="Mapa entregas agendadas (hoje)">
                    { coord ? (
                        <MapContainer center={[coord[0], coord[1]]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:'23.4em'}}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'green'}} radius={10}>
                                <Popup> Meu local </Popup>
                            </CircleMarker>
                            {/* { product.map((v, i) => (
                                <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                    <Popup> {v.ADDRESS} </Popup>
                                </CircleMarker>
                            )) } */}
                        </MapContainer>
                    ) : <LoadItem type="alt" />}
                </CardItem>
            </Col>
            <Col md={14} xs={24}>
                <CardItem title="Entregas agendadas por mês">
                    <GraphTotalUsuarios filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashMotorista