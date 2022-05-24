import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo
} from "react";
import "./styles.css";

export default function App() {
  console.log("App Render");
  return (
    <div className="App">
      <h2>Hello CodeSandbox</h2>
      <CustomForm></CustomForm>
    </div>
  );
}

const CustomForm = () => {
  console.log("CustomForm Render");
  const defaultName = "";
  const defaultSur = "";
  const nameField = useRef();
  const surField = useRef();
  const fields = useMemo(() => ({ name: nameField, sur: surField }), [
    nameField,
    surField
  ]);

  const handleChange = useCallback((e, setValue) => {
    //console.log("handleChange (for anything)");
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { form, errors } = Object.entries(fields).reduce(
        (res, [key, value]) => {
          res.form[key] = value.current.getValue();
          res.errors[key] = value.current.getErrors();
          return res;
        },
        { form: {}, errors: {} }
      );
      console.log("form", form);
      console.log("errors", errors);
    },
    [fields]
  );

  const isRequired = {
    run: (value) => !!value,
    error: "this field is required"
  };
  const isMaxLength = (max) => ({
    run: (value) => value.length <= max,
    error: `the maximum length of this field is ${max}`
  });
  const isMinLength = (min) => ({
    run: (value) => value.length > min,
    error: `the minimum length of this field is ${min}`
  });

  return (
    <form onSubmit={handleSubmit}>
      <CustomField
        ref={nameField}
        name="name"
        onChangeHandler={handleChange}
        initialValue={defaultName}
        placeholder="name"
        validators={[isRequired, isMaxLength(40), isMinLength(3)]}
      ></CustomField>
      <CustomField
        ref={surField}
        name="sur"
        onChangeHandler={handleChange}
        initialValue={defaultSur}
        placeholder="sur"
        validators={[isRequired, isMaxLength(40), isMinLength(3)]}
      ></CustomField>
      <input type="submit"></input>
    </form>
  );
};

const CustomField = forwardRef(
  ({ initialValue, name, placeholder, onChangeHandler, validators }, ref) => {
    console.log("CustomField Render", name);
    const [value, setValue] = useState(initialValue);
    const errors = useMemo(
      () =>
        validators
          .map((validator) => {
            const isValid = validator.run(value);
            if (!isValid) {
              return validator.error;
            }
            return null;
          })
          .filter((error) => !!error),
      [validators, value]
    );
    useImperativeHandle(
      ref,
      () => ({
        getValue() {
          return value;
        },
        getErrors() {
          return errors;
        }
      }),
      [value, errors]
    );
    return (
      <input
        value={value}
        name={name}
        type="text"
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onChangeHandler(e);
        }}
      ></input>
    );
  }
);
