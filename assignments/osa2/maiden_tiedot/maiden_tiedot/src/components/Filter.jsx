const Filter = ({ value, onChange }) => {
    return (
        <div>
            find countires <input value={value} onChange={onChange} />
        </div>
    );
};

export default Filter;
