from django.contrib import admin
from apps.home.models import Product, UserProfile, Order, Subscriber, Contact, HeroSlider

# Custom admin configuration
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'description', 'image')

# Register the Product model with the custom admin
admin.site.register(Product, ProductAdmin)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type')

admin.site.register(UserProfile, UserProfileAdmin)  

class OrderAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'product', 'quantity', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer_name', 'product__name')
admin.site.register(Order, OrderAdmin)

class SubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'created_at')
    search_fields = ('email',)
admin.site.register(Subscriber, SubscriberAdmin)

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'message', 'created_at')
    search_fields = ('name', 'email')
admin.site.register(Contact)  

# Register the HeroSlider model
class HeroSliderAdmin(admin.ModelAdmin):
    list_display = ('image', 'uploaded_at')
admin.site.register(HeroSlider, HeroSliderAdmin)