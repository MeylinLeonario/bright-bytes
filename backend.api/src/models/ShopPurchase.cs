namespace backend.api.src.models;

public class ShopPurchase
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ItemId { get; set; } = string.Empty;
    public int PricePaid { get; set; }
    public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    public User User { get; set; } = null!;
}