import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { AccountSettingForm } from "@/components/dashboard/account-setting-form";

const Settings = () => {
  return (
    <div className="container">
      <AccountSettingForm />
    </div>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Settings;
