"""
URL configuration for shop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from home import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('customer_homepage/about/', views.about, name='about'),
    path('customer_homepage/contact/', views.contact, name='contact'),
     path("customer_homepage/contact/map/", views.map_view, name="map"), 
    path("login/", views.login_view, name="login"),
    path('shopkeeper_dashboard/confirm_order/<int:order_id>/', views.confirm_order, name='confirm_order'),

    path("shopkeeper_dashboard/", views.shopkeeper_dashboard, name="shopkeeper_dashboard"),
    path("signup/", views.signup, name="signup"),
    path("shopkeeper_add_product/", views.shopkeeper_add_product, name="shopkeeper_add_product"),
    path('edit-product/<int:id>/', views.edit_product, name='edit_product'),
    path('delete-product/<int:id>/', views.delete_product, name='delete_product'),
    path('logout/', views.shopkeeper_logout, name='shopkeeper_logout'),

    
    path('customer_homepage/products/', views.all_products, name='all_products'),
    
    path('customer_homepage/products/grocery/', views.grocery_products, name='grocery'),
    path('customer_homepage/products/fertilizers/', views.fertilizers_products, name='fertilizers'),
    path('customer_homepage/products/animal-feed/', views.animal_feed_products, name='animal_feed'),
    path('customer_homepage/products/storage-bags/', views.storage_bags_products, name='storage_bags'),
    path('newsletter/', views.newsletter, name='newsletter'),
    path("customer_homepage/privacy-policy/", views.privacy_policy, name="privacy_policy"),
    path("customer_homepage/terms-of-service/", views.terms_of_service, name="terms_of_service"),
    path("return-policy/", views.return_policy, name="return_policy"),
    path('customer_homepage/', views.customer_homepage, name='customer_homepage'),
    path('customer_homepage/customer_orders/', views.customer_orders, name='customer_orders'),
    path('customer_homepage/profile_view/', views.profile_view, name='profile_view'),
    path('customer_homepage/edit_profile/', views.edit_profile, name='edit_profile'),
    path('customer_homepage/cart/', views.cart, name='cart'),
    path('customer_homepage/add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('customer_homepage/view_cart/', views.view_cart, name='view_cart'),
    path('customer_homepage/remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('customer_homepage/view_cart/checkout_cart/', views.checkout_cart, name='checkout_cart'),
    # path('customer_homepage/view_cart/checkout_cart/UpiPayment/<str:upi_id>/<str:name>/<str:amount>/', views.UpiPayment, name="UpiPayment"),
    # # path("customer_homepage/upload_screenshot/",views.upload_screenshot,name="upload_screenshot"),
    # path("customer_homepage/upload_screenshot/<int:order_id>/", views.upload_screenshot, name="upload_screenshot"),

    # path('customer_homepage/order-success/<int:order_id>/', views.order_success, name='order_success'),


    path('customer_homepage/view_cart/checkout_cart/UpiPayment/<str:upi_id>/<str:name>/<str:amount>/<int:order_id>/', views.UpiPayment, name="UpiPayment"),
path("customer_homepage/upload_screenshot/<int:order_id>/", views.upload_screenshot, name="upload_screenshot"),
path('customer_homepage/order-success/<int:order_id>/', views.order_success, name='order_success'),

   
    
    

    
    
 
     
   
   
]
 # Media files serve karne ke liye (development only)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
