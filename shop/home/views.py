from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from home.models import Product
from django.core.paginator import Paginator
from django.db.models import Q, Sum, Count
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import UserProfile, Order, CustomerProfile, Cart, CartItem, Subscriber, Contact
from .forms import SignupForm,ProductForm
from django.contrib.auth.models import User
import datetime
from django.contrib.auth.decorators import login_required
from decimal import Decimal
import qrcode, requests, json
from io import BytesIO
import base64
from django.core.files.storage import FileSystemStorage
from .models import HeroSlider



# Create your views here.
def home(request):
    
    return render(request, "base.html")

def about(request):
    return render(request, "about.html")
def contact(request):
    return render(request, "contact.html")
# Login and Dashboard Views
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Get user type from profile safely
            profile = UserProfile.objects.filter(user=user).first()
            if profile:
                if profile.user_type == "admin":
                    return redirect("admin_dashboard")
                elif profile.user_type == "shopkeeper":
                    return redirect("shopkeeper_dashboard")
                else:
                    return redirect("customer_homepage")
            else:
                messages.error(request, "User profile not found")
                return redirect("login")

        else:
            messages.error(request, "Invalid username or password")

    return render(request, "login.html") 
# Signup View



def signup(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user_type = request.POST.get("user_type")  # from dropdown

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            # Create user
            user = User.objects.create_user(username=username, password=password)
            # Create profile
            UserProfile.objects.create(user=user, user_type=user_type)
            messages.success(request, "Signup successful! Please login.")
            return redirect("login")
    
    return render(request, "signup.html")

#  yha se sirf shopkeeper ke liye dashboard hai
@login_required(login_url='/login/')
def shopkeeper_dashboard(request):
    # Sirf shopkeeper ke liye
    if not hasattr(request.user, 'userprofile') or request.user.userprofile.user_type != 'shopkeeper':
        return render(request, "403.html")  # Unauthorized page

    # Data calculations
    total_sales_today = (
        Order.objects.filter(status='Completed', created_at__date=datetime.date.today())
        .aggregate(total=Sum('total_amount'))['total'] or 0
    )
    pending_orders = Order.objects.filter(status='Pending').count()
    low_stock_count = Product.objects.filter(stock__lt=5).count()
    recent_orders = Order.objects.all().order_by('-created_at')[:5]
    products = Product.objects.all().order_by('-created_at')

    context = {
        'total_sales_today': total_sales_today,
        'pending_orders': pending_orders,
        'low_stock_count': low_stock_count,
        'recent_orders': recent_orders,
        'products': products,
    }

    return render(request, 'Shopkeeper.html', context)
@login_required(login_url='/login/')
def shopkeeper_add_product(request):
    
    
      if request.method == 'POST':
        name = request.POST.get('name')
        price = request.POST.get('price')
        stock = request.POST.get('stock')
        image = request.FILES.get('image')
        description = request.POST.get('description')
        category = request.POST.get('category')

        Product.objects.create(
            name=name,
            price=price,
            stock=stock,
            image=image,
            category=category,
            description = description,
        )

        return redirect('shopkeeper_dashboard')

      return render(request, 'shopkeepr_addproduct.html')

@login_required(login_url='/login/')
def confirm_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order.status = "Completed"
    order.save()
    return redirect('shopkeeper_dashboard')


@login_required(login_url='/login/')
def edit_product(request, id):
    product = get_object_or_404(Product, id=id)   # safe hai
    if request.method == "POST":
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('shopkeeper_dashboard')
    else:
        form = ProductForm(instance=product)
    return render(request, 'edit_product.html', {'form': form})
@login_required(login_url='/login/')
def delete_product(request, id):  
    product = get_object_or_404(Product, id=id)
    if request.method == "POST":
        product.delete()
        return redirect('shopkeeper_dashboard')
    return render(request, 'delete_product.html', {'product': product})

@login_required(login_url='/login/')
def shopkeeper_logout(request):
    logout(request)  
    return redirect('login') 



# customer profile view

@login_required(login_url='/login/')
def customer_homepage(request):
    slides = HeroSlider.objects.all()
    total = slides.count()

    index = int(request.GET.get("slide", 0))

    if total > 0:
        current_slide = slides[index % total]
        next_slide = (index + 1) % total
    else:
        current_slide, next_slide = None, 0

    return render(request, "customer_homepage.html", {
        "current_slide": current_slide,
        "next_slide": next_slide
    })
  



@login_required(login_url='/login/')

def profile_view(request):
    
    profile, created = CustomerProfile.objects.get_or_create(user=request.user)
    return render(request, "CustomerProfile.html", {"profile": profile})
  
  
@login_required
def edit_profile(request):
    profile = request.user.customerprofile  

    if request.method == "POST":
        profile.user.first_name = request.POST.get('first_name')
        profile.user.last_name = request.POST.get('last_name')
        profile.user.email = request.POST.get('email')
        profile.phone = request.POST.get('phone')
        profile.address = request.POST.get('address')
        if request.FILES.get('profile_image'):
            profile.profile_image = request.FILES['profile_image']
        profile.user.save()
        profile.save()
        return redirect('profile_view')
    return render(request, 'CustomerEditProfile.html', {'profile': profile})

@login_required
def customer_orders(request):
    orders = Order.objects.filter(customer_name=request.user.username).order_by('-created_at')
    return render(request, 'customer_orders.html', {'orders': orders})

@login_required(login_url='/login/')
def cart(request):
    return render(request, "cart.html")

@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    return redirect('view_cart')

@login_required
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    items = cart.items.all()

    subtotal = sum([item.get_total() for item in items])
    gst = (subtotal * Decimal('0.00')).quantize(Decimal('0'))
    shipping = Decimal('0.00') 
    total = subtotal + gst + shipping
   
  

    return render(request, 'cart.html', {
        'items': items,
        'subtotal': subtotal,
        'gst': gst,
        'shipping': shipping,
        'total': total,
    })

@login_required
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    item.delete()
    return redirect('view_cart')


@login_required
def checkout_cart(request):
    cart = Cart.objects.get(user=request.user)
    items = cart.items.all()
    total = cart.get_total() 

    if request.method == "POST":
        payment_method = request.POST.get("payment_method")
        created_orders = []

        # Har cart item ko order me save karo
        for item in items:
            order = Order.objects.create(
                customer_name=request.user.username,
                product=item.product,
                quantity=item.quantity,
                total_amount=item.get_total(),
                status="Pending" if payment_method != "Cash on Delivery" else "Completed"
            )
            created_orders.append(order)

        # Cart khali kar do
        cart.items.all().delete()

        # COD case
        if payment_method == "Cash on Delivery":
            return render(request, "payment_success.html", {"message": "Order placed successfully with Cash on Delivery!"})
        
        # UPI case - ek order id pass kar dete hain
        elif payment_method == "UPI":
            first_order_id = created_orders[0].id  # first order id for screenshot
            return redirect('UpiPayment', upi_id='subhashdangi@ibl', name='Dangi Traders', amount=total, order_id=first_order_id)
        
        else:
            return render(request, "payment_success.html", {"message": f"Payment successful via {payment_method}!"})

    return render(request, "checkoutpage.html", {
        "items": items,
        "total": total
    })

@login_required
def UpiPayment(request, upi_id, name, amount, order_id):
    # Order fetch karo
    order = get_object_or_404(Order, id=order_id, customer_name=request.user.username)

    # UPI link banate hain
    upi_link = f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"

    # QR Code generate
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(upi_link)
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")

    # Base64 me convert
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

    return render(request, "upi_payment.html", {
        "amount": amount,
        "upi_id": upi_id,
        "name": name,
        "qr_code": qr_code_base64,
        "upi_link": upi_link,
        "order": order
    })

@login_required
def upload_screenshot(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer_name=request.user.username)

    if request.method == "POST" and request.FILES.get("screenshot"):
        order.screenshot = request.FILES["screenshot"]
        order.status = "Pending"
        order.save()
        return redirect("order_success", order_id=order.id)

    return render(request, "order_success.html", {"order": order})




@login_required
def order_success(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'order_success.html', {'order': order})

@login_required(login_url='/login/')
def all_products(request):
    products = Product.objects.all()
    return render(request, "All_products.html", {"products": products, "title": "All Products"})

@login_required(login_url='/login/')
def grocery_products(request):
    products = Product.objects.filter(category__iexact="Grocery")
    return render(request, "grocery.html", {"products": products, "title": "Grocery Products"})

@login_required(login_url='/login/')
def fertilizers_products(request):
    products = Product.objects.filter(category__iexact="Fertilizers")
    return render(request, "fertilizers.html", {"products": products, "title": "Fertilizers"})

@login_required(login_url='/login/')
def animal_feed_products(request):
    products = Product.objects.filter(category__iexact="Animal Feed")
    return render(request, "animal_feed.html", {"products": products, "title": "Animal Feed"})

@login_required(login_url='/login/')
def storage_bags_products(request):
    products = Product.objects.filter(category__iexact="Storage Bags")
    return render(request, "storage_bags.html", {"products": products, "title": "Storage Bags"})

def newsletter(request):
    if request.method == "POST":
        email = request.POST.get("email")
        if Subscriber.objects.filter(email=email).exists():
            messages.warning(request, "⚠️ This email is already subscribed!")
        else:
            Subscriber.objects.create(email=email)
            messages.success(request, "🎉 You have subscribed successfully!")
        # return redirect("newsletter")  

    return render(request, "customer_homepage.html")


def contact(request):
    submitted = False  # Flag to check if form submitted successfully

    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        message = request.POST.get('message')

        if name and phone and message:
            Contact.objects.create(
                name=name,
                phone=phone,
                email=email,
                message=message
            )
            submitted = True  # Form successfully submitted
        else:
            messages.error(request, 'Please fill all required fields.')

    return render(request, 'contact.html', {'submitted': submitted})

def map_view(request):
    return render(request, "contact.html") 

def privacy_policy(request):
    return render(request, "privacy_policy.html")

def terms_of_service(request):
    return render(request, "terms_of_service.html")

def return_policy(request):
    return render(request, "return_policy.html")