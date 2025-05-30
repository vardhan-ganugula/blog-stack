import React, { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getDrafts } from "../store/blog";
import "../assets/css/drafts.css";
const DraftPage = () => {
  const dispatch = useDispatch();
  const drafts = useSelector((state) => state.blog.drafts);

  console.log(drafts);
  useEffect(() => {
    dispatch(getDrafts());
  }, []);
  return (
    <DashboardLayout>
      <div>
        <h1 className="dashboard__draft__title">Drafts</h1>
        <p className="dashboard__draft__subtitle">Manage your drafts here.</p>
      </div>
      <div className="dashboard__draft__table">
        <table className="draft__table">
          <thead>
            <tr>
              <th>
                <span>Id</span>
              </th>
              <th>
                <span>Title</span>
              </th>
              <th>
                <span>Description</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft) => (
                <tr key={draft._id}>
                  <td>
                    <span>{draft._id}</span>
                  </td>
                  <td>
                    <span>{draft.title}</span>
                  </td>
                  <td>
                    <div>
                      <span>{draft.description}</span>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default DraftPage;
