// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Card, Col, Image, Modal, Row, Typography, Upload } from "antd"
import ImgCrop from 'antd-img-crop';

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, UPLOAD_API, getToken, verifyConfig } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"
import { TableReturnButton, TableTrTrashButton } from "../../../../../components/Table/buttons"

const CacambasGaleria = ( { type, path, permission } : PageDefaultProps ) => {
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ data, setData ] = useState([])
    const [ fileList, setFileList ] = useState<any>([])

    // CARREGA FOTOS CADASTRADAS
    const onLoad = () => {
        setLoad(true)
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({STATIONARY_BUCKET_GROUP_ID: ID}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setData(res.data)
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoad(false) )
    }

    const onSave = () => {
        setLoad(true)
        POST_API(`/${path}/save.php`, { token: getToken(), master: JSON.stringify({files: fileList, STATIONARY_BUCKET_GROUP_ID: ID}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setFileList([])
                onLoad()
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoad(false) )
    }

    useEffect(() => {
        onLoad()
    }, [])
    
    return (
        <PageDefault valid={`${permission}.list`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Caçambas</Link> },
            { title: 'Galeria' },
        ]} options={
            <Row justify={'end'} gutter={[8,8]}>
                <TableReturnButton type={type} permission={permission} />
            </Row>
        }>
            <Row gutter={[16,16]}>
                <Col md={24} xs={24}>
                    { load ? <LoadItem /> :
                        <CardItem title="Galeria">
                            { data.length > 0 ? (
                                <Row gutter={[8,8]}>
                                    { data.map((v:any, i:any) => (
                                        <Col key={i} xs={24} md={6}>
                                            <Card size="small" hoverable>
                                                <Image src={v.URL} width={'100%'}/>
                                                <center style={{marginTop: 8}}><TableTrTrashButton type={'list'} permission={'cmb'} item={v} action={onLoad} path={'stationary_bucket_gallery'} /></center>
                                            </Card>
                                        </Col>
                                    )) }
                                </Row>
                            ) : (
                                <Typography>Nenhuma foto encontrada</Typography>
                            )}
                            <div style={{ marginTop: '1em' }}/>
                            { verifyConfig(`${permission}.edit`) ? (
                                <ImgCrop rotationSlider>
                                    <Upload
                                        action={UPLOAD_API}
                                        listType="picture"
                                        className="upload-list-inline"
                                        accept="image/*"
                                        fileList={fileList}
                                        onChange={({ fileList: newFileList }) => { setFileList(newFileList)}}
                                    >
                                        <Button type="primary">Nova foto</Button>
                                    </Upload>
                                </ImgCrop>
                            ) : null }
                            { fileList.length > 0 ? <Button style={{ marginTop: '1em' }} type="primary" onClick={onSave}>Enviar</Button> : null }
                        </CardItem>
                    }
                </Col>
            </Row>
        </PageDefault>
    )

}

export default CacambasGaleria;