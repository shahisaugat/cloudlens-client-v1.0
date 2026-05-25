import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const githubApi = createApi({
  reducerPath: "githubApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/github",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Repositories", "Pipelines", "Logs", "Runners", "Integrations", "AuditLogs", "Deployments", "CustomIntegrations", "WebhookPayloads", "Incidents", "Team", "Teams"],
  endpoints: (builder) => ({
    getRepositories: builder.query({
      query: () => "/repos",
      providesTags: ["Repositories"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("LOG: Failed to fetch repositories", err);
        }
      },
    }),
    getPipelines: builder.query({
      query: ({ owner, repo }) => `/repos/${owner}/${repo}/pipelines`,
      providesTags: ["Pipelines"],
    }),
    getPipelineDetails: builder.query({
      query: ({ owner, repo, runId }) => `/repos/${owner}/${repo}/pipelines/${runId}`,
      providesTags: ["Pipelines"],
    }),
    getEnvironmentStatus: builder.query({
      query: ({ owner, repo, environment }) => `/repos/${owner}/${repo}/environments/${environment}`,
      providesTags: ["Pipelines"],
    }),
    getJobLogs: builder.query({
      query: ({ owner, repo, jobId }) => ({
        url: `/repos/${owner}/${repo}/jobs/${jobId}/logs`,
        responseHandler: (response) => response.text(),
      }),
      providesTags: ["Logs"],
    }),
    rerunPipeline: builder.mutation({
      query: ({ owner, repo, runId }) => ({
        url: `/repos/${owner}/${repo}/pipelines/${runId}/rerun`,
        method: "POST",
      }),
      invalidatesTags: ["Pipelines"],
      async onQueryStarted({ owner, repo, runId }, { queryFulfilled }) {
        console.info(`LOG: Rerunning pipeline ${runId} for ${owner}/${repo}...`);
        try {
          await queryFulfilled;
          console.info(`LOG: Pipeline ${runId} rerun triggered`);
        } catch (err) {
          console.error(`LOG: Failed to rerun pipeline ${runId}`, err);
        }
      },
    }),
    getRunners: builder.query({
      query: () => "/runners",
      providesTags: ["Runners"],
    }),
    getIntegrations: builder.query({
      query: () => "/integrations",
      providesTags: ["Integrations"],
    }),
    getAuditLogs: builder.query({
      query: () => "/audit-logs",
      providesTags: ["AuditLogs"],
    }),
    getDeployments: builder.query({
      query: () => "/deployments",
      providesTags: ["Deployments"],
    }),
    updateWebhookConfig: builder.mutation({
      query: (config) => ({
        url: "/integrations/webhook",
        method: "POST",
        body: config,
      }),
      invalidatesTags: ["Integrations"],
    }),
    getWorkflows: builder.query({
      query: ({ owner, repo }) => `/repos/${owner}/${repo}/workflows`,
    }),
    getBranches: builder.query({
      query: ({ owner, repo }) => `/repos/${owner}/${repo}/branches`,
    }),
    triggerDeployment: builder.mutation({
      query: ({ owner, repo, workflowId, ref }) => ({
        url: `/repos/${owner}/${repo}/deploy`,
        method: "POST",
        body: { workflowId, ref },
      }),
      invalidatesTags: ["Pipelines", "Deployments"],
    }),
    getCustomIntegrations: builder.query({
      query: () => "/integrations/custom",
      providesTags: ["CustomIntegrations"],
    }),
    createCustomIntegration: builder.mutation({
      query: (data) => ({
        url: "/integrations/custom",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CustomIntegrations"],
    }),
    getWebhookPayloads: builder.query({
      query: (id) => `/integrations/custom/${id}/payloads`,
      providesTags: (result, error, id) => [{ type: "WebhookPayloads", id }],
    }),
    getIncidents: builder.query({
      query: () => "/incidents",
      providesTags: ["Incidents"],
    }),
    acknowledgeIncident: builder.mutation({
      query: (id) => ({
        url: `/incidents/${id}/acknowledge`,
        method: "POST",
      }),
      invalidatesTags: ["Incidents"],
    }),
    resolveIncident: builder.mutation({
      query: (id) => ({
        url: `/incidents/${id}/resolve`,
        method: "POST",
      }),
      invalidatesTags: ["Incidents"],
    }),
    createIncident: builder.mutation({
      query: (data) => ({
        url: "/incidents",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Incidents"],
    }),
    getTeam: builder.query({
      query: () => "/team",
      providesTags: ["Team"],
    }),
    getAllTeams: builder.query({
      query: () => "/teams",
      providesTags: ["Teams"],
    }),
    getTeamDetails: builder.query({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: "Teams", id }],
    }),
    createTeam: builder.mutation({
      query: (data) => ({
        url: "/teams",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Teams"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams"],
    }),
    assignTeams: builder.mutation({
      query: (data) => ({
        url: "/team/assign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetRepositoriesQuery,
  useGetPipelinesQuery,
  useGetPipelineDetailsQuery,
  useGetEnvironmentStatusQuery,
  useGetJobLogsQuery,
  useRerunPipelineMutation,
  useGetRunnersQuery,
  useGetIntegrationsQuery,
  useGetAuditLogsQuery,
  useGetDeploymentsQuery,
  useUpdateWebhookConfigMutation,
  useGetWorkflowsQuery,
  useGetBranchesQuery,
  useTriggerDeploymentMutation,
  useGetCustomIntegrationsQuery,
  useCreateCustomIntegrationMutation,
  useGetWebhookPayloadsQuery,
  useGetIncidentsQuery,
  useAcknowledgeIncidentMutation,
  useResolveIncidentMutation,
  useCreateIncidentMutation,
  useGetTeamQuery,
  useGetAllTeamsQuery,
  useGetTeamDetailsQuery,
  useAssignTeamsMutation,
  useCreateTeamMutation,
  useDeleteTeamMutation,
} = githubApi;
