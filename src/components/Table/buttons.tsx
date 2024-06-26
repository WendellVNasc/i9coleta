// BIBLIOTECAS REACT
import { Button, Col, Modal, QRCode, Typography, Upload, message } from "antd"
import { Link } from "react-router-dom"

// SERVIÇOS
import { POST_API, POST_CATCH, UPLOAD_API, getToken, verifyConfig } from "../../services"

// ICONES
import { IoAddCircleOutline, IoArrowBack, IoTrashOutline } from "react-icons/io5"
import { TbArrowBack, TbBarrierBlock, TbChecks, TbDetails, TbEdit, TbList, TbMapPinExclamation, TbPasswordUser, TbPhoto, TbQrcode, TbShoppingCart, TbTrash, TbX } from "react-icons/tb"
import { ExclamationCircleOutlined } from '@ant-design/icons';

// LOGO
import logo from '../../assets/images/logos/Logo Completa/PNG_.Completa - Fundo Transparente.png';
import ImgCrop from "antd-img-crop"
import html2canvas from "html2canvas"

// INTERFACE
interface TableButtonInterface {
    type: 'list' | 'trash' | 'add' | 'edit',
    permission: string,
    item?: any,
    path?: string,
    action?: any,
}

export const TableNewButton = ( { type, permission } : TableButtonInterface ) => {
    if ( type === 'list' && verifyConfig(`${permission}.add`) ) {
        return <Col><Link to="novo"><Button size="small" shape="circle" type='text' className="page-default-button"><IoAddCircleOutline /></Button></Link></Col>
    }
    return null
}

export const TableTrashButton = ( { type, permission } : TableButtonInterface ) => {
    if ( type === 'list' && verifyConfig(`${permission}.trash`) ) {
        return <Col><Link to="lixeira"><Button size="small" shape="circle" type='text' className="page-default-button"><IoTrashOutline /></Button></Link></Col>
    }
    return null
}

export const TableReturnButton = ( { type, permission } : TableButtonInterface ) => {
    if ( (type === 'trash' || type === 'add' || type === 'edit') && verifyConfig(`${permission}.list`) ) {
        return <Col><Link to={'..'}><Button size="small" shape="circle" type='text' className="page-default-button"><IoArrowBack /></Button></Link></Col>
    }
    return null
}

export const TableTrEditButton = ( { type, permission, item } : TableButtonInterface ) => {
    if ( type === 'list' && verifyConfig(`${permission}.edit`) ) {
        return <Col><Link to={String(item.ID)}><TbEdit size={18} className="actions-button"/></Link></Col>
    }
    return null
}

export const TableTrCartButton = ( { type, permission, item } : TableButtonInterface ) => {
    if ( type === 'list' && verifyConfig(`${permission}.list`) ) {
        return <Col><Link to={String(item.ID)+'/itens'}><TbShoppingCart size={18} className="actions-button"/></Link></Col>
    }
    return null
}

export const TableTrPhotoButton = ( { type, permission, item, action } : TableButtonInterface ) => {
    const onChangePic = (value:any) => {
        if (value.file.response?.url) {
            POST_API('/credential/save.php', { token: getToken(), master: JSON.stringify({PHOTO: value.file.response?.url, ID: item.ID}) }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    action()
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH)
        }
    }
    if ( type === 'list' && verifyConfig(`${permission}.edit`) ) {
        return <Col><ImgCrop modalTitle="Atualizar imagem" modalOk="Salvar" modalCancel="Cancelar"><Upload accept="image/jpg,image/jpeg,image/png" maxCount={1} showUploadList={false} action={UPLOAD_API} onChange={onChangePic}><TbPhoto size={18} className="actions-button"/></Upload></ImgCrop></Col>
    }
    return null
}

export const TableTrGalleryButton = ( { type, permission, item } : TableButtonInterface ) => {
    if ( type === 'list' ) {
        return <Col><Link to={String(item.ID)+'/galeria'}><TbPhoto size={18} className="actions-button"/></Link></Col>
    }
    return null
}

export const TableTrDetailButton = ( { type, permission, item } : TableButtonInterface ) => {
    if ( type === 'list' ) {
        return <Col><Link to={String(item.ID)+'/detalhes'}><TbList size={18} className="actions-button"/></Link></Col>
    }
    return null
}

export const TableTrMapButton = ( { type, permission, item } : TableButtonInterface ) => {
    if ( type === 'list' ) {
        return <Col><Link to={String(item.ID)+'/mapa'}><TbMapPinExclamation size={18} className="actions-button"/></Link></Col>
    }
    return null
}

export const TableTrQrCodeButton = ( { type, item } : TableButtonInterface ) => {
    
    const onOpen = () => {
        Modal.confirm({
            title: item.CODE ?
                <div className="i9-qrcode" id="myqrcode">
                    <center><img src={logo} width={100}/></center>
                    <center><QRCode bgColor="#FFF" value={item.CODE} size={300} /></center>
                    <center><Typography>{item.CODE}</Typography></center>
                </div>
            : 'QRcode não cadastrado', icon: <></>, cancelText: 'Fechar', okText: 'Download', okButtonProps: { disabled: !item.CODE },
            onOk: () => {
                const div:any = document.getElementById('myqrcode')
                html2canvas(div).then(function(canvas) {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL("image/png");
                    link.download = item.CODE+' QRCode.png';
                    link.click();
                    link.remove()
                });
            }
        })
    }
    
    if ( type === 'list' ) {
        return <Col><TbQrcode size={18} onClick={onOpen} className="actions-button"/></Col>
    }
    return null
}

export const TableTrTrashButton = ( { type, permission, item, path, action } : TableButtonInterface ) => {

    // AÇÃO DE DELETE
    const onAction = () => {
        Modal.confirm({
            title: 'Deletar registro?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/del.php`, { token: getToken(), ID: item.ID, type: 'del' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'list' && verifyConfig(`${permission}.del`) ) {
        return <Col><TbTrash onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null
}

export const TableTrCancelButton = ( { type, permission, item, path, action } : TableButtonInterface ) => {

    // AÇÃO DE DELETE
    const onAction = () => {
        Modal.confirm({
            title: 'Cancelar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/cancel.php`, { token: getToken(), ID: item.ID, type: 'del' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'list' && verifyConfig(`${permission}.edit`) && item.STATUS == 'AR' ) {
        return <Col><TbX onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null
    
}

export const TableTrRecuseButton = ( { type, permission, item, path, action } : TableButtonInterface ) => {

    // AÇÃO DE DELETE
    const onAction = () => {
        Modal.confirm({
            title: 'Recusar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/recuse.php`, { token: getToken(), ID: item.ID, type: 'del' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'list' && verifyConfig(`${permission}.edit`) && item.STATUS == 'AR' ) {
        return <Col><TbBarrierBlock onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null

}

export const TableTrAcceptButton = ( { type, permission, item, path, action } : TableButtonInterface ) => {

    // AÇÃO DE DELETE
    const onAction = () => {
        Modal.confirm({
            title: 'Aceitar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/accept.php`, { token: getToken(), ID: item.ID, type: 'del' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'list' && verifyConfig(`${permission}.edit`) && item.STATUS == 'AR' ) {
        return <Col><TbChecks onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null

}

export const TableTrRecoverButton = ( { type, permission, item, path, action } : TableButtonInterface ) => {

    // AÇÃO DE RECOVER
    const onAction = () => {
        Modal.confirm({
            title: 'Recuperar registro?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/del.php`, { token: getToken(), ID: item.ID, type: 'rec' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'trash' && verifyConfig(`${permission}.rec`) ) {
        return <Col><TbArrowBack onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null
}

export const TableTrPassword =  ( { type, item, path, action } : TableButtonInterface ) => {

    // AÇÃO RESTAURAR SENHA
    const onAction = () => {
        Modal.confirm({
            title: 'Restaurar senha?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/${path}/recpass.php`, { token: getToken(), ID: item.ID }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        action()
                    } else {
                        Modal.warning({ title: 'Algo deu errado', content: res.msg })
                    }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    if ( type === 'list' ) {
        return <Col><TbPasswordUser onClick={onAction} size={18} className="actions-button"/></Col>
    }
    return null

}