// BIBLIOTECAS REACT
import { Button, Col, Modal, Row, Slider, Tag, Typography } from "antd";
import { useEffect, useState } from "react";

// ICONES
import { IoClose } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import { BsCurrencyDollar, BsPinMap, BsSortDownAlt, BsStar } from "react-icons/bs";

// CSS
import './style.css';
import { POST_API, getToken } from "../../services";

// INTERFACE
interface ModalFiltrosInterface {
    open: boolean,
    close: any
}

const ModalFiltros = ( { open, close } : ModalFiltrosInterface ) => {

    // ESTADOS DO COMPONENTE
    const [ tab, setTab ] = useState<number>(1)

    const [ typeLocalI, setTypeLocalI ] = useState<boolean>(true)
    const [ typeLocalE, setTypeLocalE ] = useState<boolean>(true)

    const [ order, setOrder ] = useState<'O'|'P'|'A'|'D'>('O')

    const [ typeLid, setTypeLid ] = useState<'A'|'C'|'S'|''>('')

    const [ distance, setDistance ] = useState<number>(20)

    const [ price, setPrice ] = useState<number[]>([0, 10000])

    const [ residue, setResidue ] = useState<any[]>([])
    const [ residueSelect, setResidueSelect ] = useState<any[]>([])
    const [ loadResidue, setLoadResidue ] = useState<boolean>(false)

    const onClear = () => {
        setTypeLocalE(true)
        setTypeLocalI(true)
        setOrder('O')
        setTypeLid('')
        setDistance(20)
        setPrice([0, 10000])
        setResidueSelect([])
    }

    const onResidue = () => {
        POST_API('/reside/search.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            setResidue(res.data)
        })
    }

    // SELECIONA PERMISSÃO
    const onResidueSelect = (val: any) => {

        setLoadResidue(true)

        var temp = residueSelect
        if (temp.includes(val)) {
            temp.splice(temp.indexOf(val), 1)
        } else {
            temp.push(val)
        }

        setResidueSelect(temp)
        setTimeout(() => {
            setLoadResidue(false)
        }, 500);
        
    } 

    useEffect(() => {
        onResidue()
    }, [open])

    return (
        <Modal open={open} footer={false} closable={false} style={{top: 25}}>
            <Row justify={'space-between'} align={'middle'} gutter={[8,16]}>
                <Col style={{height: 19.6}}><IoClose className="mf-icones" onClick={close} /></Col>
                <Col><Typography className="mf-titulo">Filtros</Typography></Col>
                <Col style={{height: 19.6}}><AiOutlineClear onClick={onClear} className="mf-icones" /></Col>
                <Col span={24}>
                    <div className="mf-tab">
                        <div className={`mf-tab-item ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}><Typography>Básicos</Typography></div>
                        <div className={`mf-tab-item ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}><Typography>Resíduos</Typography></div>
                    </div>
                    { tab === 1 ? (
                        <Row gutter={[18,18]}>
                            <Col span={24}>
                                <Typography className="mf-title">Tipo de locação</Typography>
                                <Row gutter={[4,4]} key={'type'}>
                                    <Col><Tag className={`mf-tag ${typeLocalE ? 'active' : ''}`} onClick={() => setTypeLocalE(!typeLocalE)}>Locação Externa</Tag></Col>
                                    <Col><Tag className={`mf-tag ${typeLocalI ? 'active' : ''}`} onClick={() => setTypeLocalI(!typeLocalI)}>Locação Interna</Tag></Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Typography className="mf-title">Tipo de tampa</Typography>
                                <Row gutter={[4,4]}>
                                    <Col><Tag className={`mf-tag ${typeLid === 'S' ? 'active' : ''}`} onClick={() => setTypeLid('S')}>Sem Tampa</Tag></Col>
                                    <Col><Tag className={`mf-tag ${typeLid === 'C' ? 'active' : ''}`} onClick={() => setTypeLid('C')}>Tampa Corrediça</Tag></Col>
                                    <Col><Tag className={`mf-tag ${typeLid === 'A' ? 'active' : ''}`} onClick={() => setTypeLid('A')}>Tampa Articulada</Tag></Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Typography className="mf-title">Ordenar por</Typography>
                                <Row gutter={[4,4]} justify={'space-between'}>
                                    <Col onClick={() => setOrder('O')}><div className={`mf-bt-ordem ${ order === 'O' ? 'active' : '' }`}><BsSortDownAlt className="mf-ic-ordem"/></div><br/><Typography className={`mf-tx-ordem ${ order === 'O' ? 'active' : '' }`}>Padrão</Typography></Col>
                                    <Col onClick={() => setOrder('P')}><div className={`mf-bt-ordem ${ order === 'P' ? 'active' : '' }`}><BsCurrencyDollar className="mf-ic-ordem"/></div><br/><Typography className={`mf-tx-ordem ${ order === 'P' ? 'active' : '' }`}>Preço</Typography></Col>
                                    <Col onClick={() => setOrder('A')}><div className={`mf-bt-ordem ${ order === 'A' ? 'active' : '' }`}><BsStar className="mf-ic-ordem"/></div><br/><Typography className={`mf-tx-ordem ${ order === 'A' ? 'active' : '' }`}>Avaliação</Typography></Col>
                                    <Col onClick={() => setOrder('D')}><div className={`mf-bt-ordem ${ order === 'D' ? 'active' : '' }`}><BsPinMap className="mf-ic-ordem"/></div><br/><Typography className={`mf-tx-ordem ${ order === 'D' ? 'active' : '' }`}>Menor Distância</Typography></Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Typography className="mf-title">Distância</Typography>
                                <Typography className="mf-subtitle">menos de {distance} km</Typography>
                                <div className="mf-sl-div"> <Typography className="mf-sl-mark">0 km</Typography> <Typography className="mf-sl-mark">100 km</Typography> </div>
                                <Slider value={distance} onChange={setDistance} min={0} max={100} styles={{ track: { background: 'var(--color02)' } }} />
                            </Col>
                            <Col span={24}>
                                <Typography className="mf-title">Preço</Typography>
                                <Typography className="mf-subtitle">entre R$ {price[0]} e R$ {price[1]}</Typography>
                                <div className="mf-sl-div"> <Typography className="mf-sl-mark">R$ 0,00</Typography> <Typography className="mf-sl-mark">R$ 10.000,00</Typography> </div>
                                <Slider value={price} range={true} onChange={setPrice} min={0} max={10000} styles={{ track: { background: 'var(--color02)' } }} />
                            </Col>
                        </Row>
                    ) : tab === 2 ? (
                        <Row gutter={[8,8]}>
                            <Col span={24} key={'reside'}>
                                <Typography className="mf-title">Selecionar resíduos</Typography>
                                <Row gutter={[4,4]}>
                                    { residue.map((v:any, i:any) =>
                                        loadResidue ? <Col><Tag onClick={() => onResidueSelect(Number(v.ID))} className={`mf-tag ${residueSelect.includes(Number(v.ID)) ? 'active' : ''}`}>{v.NAME}</Tag></Col> : <Col><Tag onClick={() => onResidueSelect(Number(v.ID))} className={`mf-tag ${residueSelect.includes(Number(v.ID)) ? 'active' : ''}`}>{v.NAME}</Tag></Col>
                                    ) }
                                </Row>
                            </Col>
                        </Row>
                    ) : null }
                </Col>
                <Col span={24}>
                    <Button block type="primary" size="large">Ver resultados</Button>
                </Col>
            </Row>
        </Modal>
    )

}

export default ModalFiltros;