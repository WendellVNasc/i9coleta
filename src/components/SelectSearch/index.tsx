// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Select, Spin } from "antd"

// SERVIÇOS
import { POST_API, POST_CATCH, getToken } from "../../services"

// INTERFACE
interface SelectSearchInterface {
    url: string,
    change: any,
    value: string,
    placeholder: string,
    disabled?: boolean,
    effect?: string
}

const SelectSearch = ( { url, change, value, placeholder, disabled = false, effect = "" } : SelectSearchInterface ) => {

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(false)
    const [ options, setOptions ] = useState([])

    // BUSCAR DADOS
    const onSearch = (search: string) => {

        setLoad(true)
        setOptions([])
        POST_API(url, { token: getToken(), filters: JSON.stringify({search: search}) }).then(rs => rs.json()).then(res => {
            setOptions( res.data ? res.data : [] )
        }).catch(POST_CATCH).finally(() => setLoad(false))

    }

    // DEFAULT VALUE
    useEffect(() => {
        if (effect !== null) {
            setLoad(true)
            POST_API(url, { token: getToken(), filters: JSON.stringify(effect) }).then(rs => rs.json()).then(res => {
                setOptions( res.data ? res.data : [] )
                if (res.data?.[0]) change(res.data?.[0], [])
            }).catch(POST_CATCH).finally(() => setLoad(false))
        }
    }, [effect])

    return (
        <Select
            labelInValue
            filterOption={false}
            style={{ width: '100%' }}
            options={options}
            onSearch={onSearch}
            showSearch={true}
            allowClear
            notFoundContent={load ? <Spin size="small" /> : null}
            onChange={change}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
        />
    )
}

export default SelectSearch;