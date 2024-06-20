// BIBLIOTECAS REACT
import { Avatar, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

// ICONES
import { IoStar } from 'react-icons/io5'

// CSS
import './styles.css'

// INTERFACE
interface CardCacambaProviderInterface {
    item: any,
    action?: any
}

const CardCacambaProvider = ( { item, action = () => {} } : CardCacambaProviderInterface ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()

    return (
        <div className="card-cacamba" onClick={() => navigate(`/painel/pedircacamba/cacamba/${item?.ID}`)}>
            <div className='card-cacamba-div'>
                <div className='card-cacamba-text-row'>
                    <Typography className="card-cacamba-name">Modelo {item?.STATIONARY_BUCKET_TYPE_NAME} <span></span></Typography>
                    <Typography className="card-cacamba-subtitle"><span className='star'><IoStar style={{marginLeft: '0.2em', marginRight: '0.2em'}} /> 0 </span></Typography>
                </div>
                <Typography className="card-cacamba-subtitle desc">{item?.TYPE_LID_NAME} • Cor {item?.COLOR} • {item?.MATERIAL}</Typography>
                <Typography className="card-cacamba-price hidden">{ item?.PRICE_EXTERNAL > 0 ? <><span>Locação externa: </span>{item?.PRICE_EXTERNAL_NAME}</> : null } { item?.PRICE_INTERNAL > 0 ? <><span>Locação interna: </span>{item?.PRICE_INTERNAL_NAME}</> : null }</Typography>
                <div className='card-cacamba-price-row'>
                    { item?.PRICE_EXTERNAL > 0 ? <Typography className='card-cacamba-price'><span>Locação externa</span><br/>{item?.PRICE_EXTERNAL_NAME}</Typography> : null }
                    { item?.PRICE_INTERNAL > 0 ? <Typography className='card-cacamba-price'><span>Locação interna</span><br/>{item?.PRICE_INTERNAL_NAME}</Typography> : null }
                </div>
            </div>
            <Avatar src={item?.GALLERY?.[0]?.URL}shape="square" className="card-cacamba-avt" />
        </div>
    )

}

export default CardCacambaProvider