"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addBreadcrumb, clearBreadcrumb } from "@/store/slices/breadcrumb"; // Adjust the path
import { projectsApi } from "@/lib/api"; // Adjust based on your API setup

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;
  const dispatch = useAppDispatch();
  const breadcrumbItems = useAppSelector((state) => state.breadcrumb.items);
  const currentBreadcrumb = breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1] : null;
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (isFetching) return; // Prevent multiple simultaneous fetches
      setIsFetching(true);
      try {
        const project = await projectsApi.getProject(projectId!); // Fetch project details
        dispatch(clearBreadcrumb());
        dispatch(addBreadcrumb({ id: project._id, name: project.name })); // Store id and name in Redux
      } catch (error) {
        console.error("Failed to fetch project details:", error);
        router.push("/dashboard"); // Fallback to dashboard on error
      } finally {
        setIsFetching(false);
      }
    };

    // If projectId is not present, clear the breadcrumb
    if (!projectId) {
      dispatch(clearBreadcrumb());
    } else {
      // If projectId doesn't match the Redux breadcrumb id, fetch project details
      if (projectId !== currentBreadcrumb?.id) {
        fetchProjectDetails();
      }
    }
  }, [projectId, currentBreadcrumb, router, dispatch, isFetching]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2
        className="text-xl font-semibold text-dark dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/dashboard"
            >
              {currentBreadcrumb ? currentBreadcrumb.name : "Home"}
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;