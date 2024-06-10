// BIBLIOTECAS REACT
import { Avatar, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

// ICONES
import { IoStar } from 'react-icons/io5'

// CSS
import './styles.css'

// INTERFACE
interface CardCacambaCartInterface {
    item: any,
    action?: any
}

const CardCacambaCart = ( { item, action = () => {} } : CardCacambaCartInterface ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()

    return (
        <div className="card-cacamba" onClick={() => navigate(`/painel/pedircacamba/cacamba/${item?.PRODUCT_ID}`)}>
            <div className='card-cacamba-div cart'>
                <Typography onClick={() => navigate(`/painel/pedircacamba/fornecedor/${item?.PROVIDER_ID}`)} className='card-cacamba-title'><Avatar src={item?.PROVIDER_PHOTO} className='card-cacamba-title-avt'/>{String(item?.PROVIDER_NAME).toLocaleUpperCase()}</Typography>
                <div className='card-cacamba-text-row'>
                    <Typography className="card-cacamba-name">Modelo {item?.STATIONARY_BUCKET_TYPE_NAME} <span></span></Typography>
                </div>
                <Typography className="card-cacamba-subtitle">{item?.TYPE_LID_NAME} • Cor {item?.COLOR} • {item?.MATERIAL} • {item?.TYPE_LOCAL === 'E' ? item?.DAYS_EXTERNAL : item?.DAYS_INTERNAL}</Typography>
                <Typography className="card-cacamba-subtitle" style={{color: 'var(--color01)'}}>Para {item?.ADDRESS?.STREET}, {item?.ADDRESS?.NUMB} - {item?.ADDRESS?.DISTRICT} - {item?.ADDRESS?.CITY_NAME} / {item?.ADDRESS?.STATE_ACRONYM}</Typography>
                <Typography className="card-cacamba-price-cart">{item?.QTDE} x { item?.TYPE_LOCAL === 'E' ? item?.PRICE_EXTERNAL_NAME : item?.PRICE_INTERNAL_NAME }</Typography>
           </div>
            <Avatar src={item?.GALLERY?.[0]?.URL}shape="square" className="card-cacamba-avt cart" />
        </div>
    )

}

export default CardCacambaCart