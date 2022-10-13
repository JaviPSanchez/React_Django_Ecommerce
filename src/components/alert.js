import { connect } from "react-redux";
import { CheckCircleIcon } from "@heroicons/react/solid";

function Alert({ alert }) {
  console.log(alert);

  const displayAlert = () => {
    if (alert !== null) {
      return (
        <div className={`rounded-md ${alert.alertType} p-4`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className={`h-5 w-5 ${alert.alertType}`}
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${alert.alertType}`}>
                {alert.msg}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  return <>{displayAlert()}</>;
}

const mapStateToProps = (state) => ({
  alert: state.Alert.alert,
});

export default connect(mapStateToProps)(Alert);
