-- =========================================================
-- Create missing RPC functions required by the auth provider
-- =========================================================

-- get_my_permissions: returns all permission slugs for the logged-in user
CREATE OR REPLACE FUNCTION get_my_permissions()
RETURNS TABLE (permission_slug TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.key::TEXT
  FROM permissions p
  JOIN role_permissions rp ON rp.permission_id = p.id
  JOIN user_roles ur ON ur.role_id = rp.role_id
  WHERE ur.user_id = auth.uid()
  UNION
  SELECT DISTINCT p.key::TEXT
  FROM permissions p
  JOIN role_permissions rp ON rp.permission_id = p.id
  JOIN roles r ON r.id = rp.role_id
  WHERE r.slug = (SELECT user_role FROM user_profiles WHERE id = auth.uid());
END;
$$;

-- get_user_roles: returns all roles (id, slug, name) for the logged-in user
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS TABLE (role_id UUID, role_slug TEXT, role_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.slug::TEXT, r.name::TEXT
  FROM roles r
  JOIN user_roles ur ON ur.role_id = r.id
  WHERE ur.user_id = auth.uid()
  UNION
  SELECT r.id, r.slug::TEXT, r.name::TEXT
  FROM roles r
  WHERE r.slug = (SELECT user_role FROM user_profiles WHERE id = auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION get_my_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_roles() TO authenticated;
