import ReactSelect, { components } from 'react-select';

export function Select(props) {
    const {options, ...restProps} = props
    const { Option } = components;
    const IconOption = optionProps => (
      <Option {...optionProps}>
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <img
            src={optionProps.data.icon}
            style={{ width: 24, marginRight: 8 }}
            alt=""
            />
            {optionProps.data.label}
        </div>
      </Option>
    );

    return <ReactSelect className='select-option' options={options}
            components={{ Option: IconOption }} {...restProps} />
}