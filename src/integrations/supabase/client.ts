export const supabase = {
  functions: {
    invoke: async () => {
      return {
        data: null,
        error: new Error("Supabase client not configured in this project."),
      };
    },
  },
};
