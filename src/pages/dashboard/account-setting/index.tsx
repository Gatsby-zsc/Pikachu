import DashboardLayout from "@/components/dashboard/layout";
import { type ReactElement } from "react";
import { AccountSettingForm } from "@/components/dashboard/account-setting-form";
import { api } from "@/utils/api";

const Settings = () => {
  const { data: userDetail } = api.userRouter.getUserDetails.useQuery();

  if (!userDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <AccountSettingForm user={userDetail} />
    </div>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Settings;
