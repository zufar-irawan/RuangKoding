-- Create a function to increment question view count
CREATE OR REPLACE FUNCTION increment_question_view(question_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE questions
  SET view = COALESCE(view, 0) + 1
  WHERE id = question_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_question_view(bigint) TO authenticated;

-- Grant execute permission to anonymous users (if you want unauthenticated users to increment views)
GRANT EXECUTE ON FUNCTION increment_question_view(bigint) TO anon;
