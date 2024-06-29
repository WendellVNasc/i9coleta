// BIBLIOTECAS REACT
import { Typography } from 'antd'

// CSS
import './styles.css'
import { useNavigate } from 'react-router-dom'

// INTERFACE
interface CardModelInterface {
    item: any
}

const CardModel = ( { item } : CardModelInterface ) => {

    const navigate = useNavigate()

    return (
        <div className="card-model">
            <div className='card-model-div' onClick={() =>  navigate(`/painel/pedircacamba/modelo/${item.id}`)}>
                <img className="card-model-img" src={item.photo} alt={item.name} />
                <Typography className="card-model-title">{item.name}</Typography>
            </div>
        </div>
    )

}

export default CardModel