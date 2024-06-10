// CSS
import './styles.css'

// COMPONENTES
import LoadItem from '../LoadItem'
import CardCacambaShop from './shop'
import CardCacambaProvider from './provider'
import CardCacambaCart from './cart'

// INTERFACE
interface CardCacambaInterface {
    item: any,
    action?: any,
    type: 'shop' | 'cart' | 'provider',
}

const CardCacamba = ( { item, type, action = () => {} } : CardCacambaInterface ) => {

    if (type === 'shop') return <CardCacambaShop item={item} action={action} />
    if (type === 'cart') return <CardCacambaCart item={item} action={action} />
    if (type === 'provider') return <CardCacambaProvider item={item} action={action} />
    
    return <LoadItem title='Componente inválido' />

}

export default CardCacamba