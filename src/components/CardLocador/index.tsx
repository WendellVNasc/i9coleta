// BIBLIOTECAS REACT
import { Avatar, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

// ICONES
import { IoStar } from 'react-icons/io5'

// CSS
import './styles.css'

// INTERFACE
interface CardLocadorInterface {
    item: any
}

const CardLocador = ( { item } : CardLocadorInterface ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()

    return (
        <div className="card-locador" onClick={() => navigate(`/painel/pedircacamba/fornecedor/${item?.ID}`)}>
            <Avatar className="card-locador-avt" size={80} src={item?.PHOTO} />
            <div style={{marginLeft: '1em'}}>
                <Typography className="card-locador-title">{item?.NAME}</Typography>
                <Typography className="card-locador-subtitle"><span className='star'><IoStar style={{marginRight: '0.2em'}} /> 0 </span> • 0 Km</Typography>
            </div>
        </div>
    )

}

export default CardLocador