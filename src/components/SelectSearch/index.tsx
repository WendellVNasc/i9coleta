// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Select, Spin } from "antd";

// SERVIÇOS
import { GET_API, POST_API, POST_CATCH, getToken } from "../../services";

// INTERFACE
interface SelectSearchInterface {
  url: string;
  change: any;
  value: string;
  placeholder: string;
  disabled?: boolean;
  effect?: string;
  labelField?: string | Array<string>;
}

function transformArray(data: any, valueField: any, labelFields: any) {
  return data.map((item: any) => {
    const value = item[valueField].toString();
    let label;

    if (Array.isArray(labelFields)) {
      label = `${item[labelFields[0]]} - ${item[labelFields[1]]}`;
    } else {
      label = item[labelFields];
    }

    return {
      value: value,
      label: label,
    };
  });
}

const SelectSearch = ({
  url,
  change,
  value,
  placeholder,
  disabled = false,
  effect = "",
  labelField,
}: SelectSearchInterface) => {
  // ESTADOS DO COMPONENTE
  const [load, setLoad] = useState(false);
  const [options, setOptions] = useState([]);
  // BUSCAR DADOS
  const onSearch = (search: string) => {
    setLoad(true);
    setOptions([]);
    GET_API(`${url}?search=${search}`)
      .then((response) => {
        if (!response.ok) {
          POST_CATCH();
        }
        response.json().then((data) => {
          setOptions(
            data.data ? transformArray(data.data, "id", labelField) : []
          );
        });
      })
      .finally(() => setLoad(false));
  };

  // DEFAULT VALUE
  // useEffect(() => {
  //   if (effect !== null) {
  //     setLoad(true);
  //     POST_API(url, { token: getToken(), filters: JSON.stringify(effect) })
  //       .then((rs) => rs.json())
  //       .then((res) => {
  //         setOptions(res.data ? res.data : []);
  //         if (res.data?.[0]) change(res.data?.[0], []);
  //       })
  //       .catch(POST_CATCH)
  //       .finally(() => setLoad(false));
  //   }
  // }, [effect]);

  return (
    <Select
      labelInValue
      filterOption={false}
      style={{ width: "100%" }}
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
  );
};

export default SelectSearch;
