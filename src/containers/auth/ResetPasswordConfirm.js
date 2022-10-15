import { useState, useEffect } from "react";
import Layout from "../../hocs/Layout";
//Para poder usar la funcion signup hay que conectarla correctamente
import { connect } from "react-redux";
import { reset_password_confirm } from "../../redux/actions/auth";
import { Oval } from "react-loader-spinner";
import { Link, Navigate, useParams } from "react-router-dom";

function ResetPasswordConfirm({ reset_password_confirm, loading }) {
  const params = useParams();

  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //Procesamos los inputs, declaramos la variable formData que contiene todo
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;

  // Cada vez que pongamos algo en los inputs, react lo detecta y cambiamos el value del input por el name

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const uid = params.uid;
    const token = params.token;

    reset_password_confirm(uid, token, new_password, re_new_password);
    if (new_password === re_new_password) setRequestSent(true);
  };

  if (requestSent && !loading) return <Navigate to="/" />;

  return (
    <Layout>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set your new password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={(event) => onSubmit(event)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    onChange={(event) => onChange(event)}
                    name="new_password"
                    value={new_password}
                    type="password"
                    placeholder="Password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reset password
                </label>
                <div className="mt-1">
                  <input
                    onChange={(event) => onChange(event)}
                    name="re_new_password"
                    value={re_new_password}
                    type="password"
                    placeholder="Repeat password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                {loading ? (
                  <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Oval color="#fff" width={20} height={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Email
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
// Creamos todo esto para poder pasar como props la funcion login
const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, {
  reset_password_confirm,
})(ResetPasswordConfirm);
