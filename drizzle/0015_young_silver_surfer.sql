-- Create indexes for frequently accessed columns
CREATE INDEX IF NOT EXISTS idx_product_status_created ON products(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_category_status ON products(category_id, status);
CREATE INDEX IF NOT EXISTS idx_order_user_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_product_price_discount ON products(price, discount_price) 
  WHERE discount_price IS NOT NULL;

-- Create materialized view for order statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS order_statistics AS
SELECT 
  date_trunc('day', created_at) as order_date,
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM orders
GROUP BY date_trunc('day', created_at), status;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_order_statistics()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY order_statistics;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_order_statistics_trigger
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_order_statistics(); 