In this blog, I will show you how to design your hand-made personal card and share your information to others with a touch on phone. The main contribution of this post is about a simple web interface for designing card appearance. You can export it as PDF to easier print out. Code is already available on my [Github](https://github.com/tuminguyen/ezTap_Card).


### Buy card

You can buy cards at anywhere, any stores and it is cheap. For me, I pick it up from Amazon. Just try to look up the terms **"Ntag215 NFC"** and pay for the one you like most. Following is the link for items that I have bought: [NFC pack of 10](https://www.amazon.de/-/en/gp/product/B086PXKTMG/ref=ox_sc_act_title_1?smid=A2KC9HWF6AI30D&psc=1).

### Link your info together

There are several ways to link all your information: name, phone, email, facebook, instagram, soundcloud\ etc., into one place. You can try [Linktree](https://linktr.ee/admin/settings) or [Instabio](https://instabio.cc/) or any kinds of platform letting you do that. 


### Customize your card

There are 4 things you can change for your card apperance: the background, your name, the link to your account and different logo style. When you insert your linktree link or instabio link, the QR code will be auto generated and changed accordingly. 
<p>
    <center><img alt='blank-card' src="image/b9_blank.png" width="435" height="270px"/></center>
</p>
<p float="left">
    <img alt='demo-card' src="image/b9_demo_card.png" width="380" height="245px" /> 
    <img alt='demo-card2' src="image/b9_demo.png" width="380" height="245px" margin="0 30px"/> 
    <img alt='demo-card2' src="image/b9_demoo.png" width="380" height="245px"/>
</p>


Above, you can see a blank card and the customized ones. When you satisfy with the apperance, you can export it to PDF. I already set it to the normal dimensions of the card (85.5 x 54 mm). However, you can change the number to fit with your card. Print it on an A4 page, cut it then paste to the NFC card you've bought.

### Write information to card

Afterall, you need to download [NFC Tools](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc&hl=en&gl=US) on your phone to write the card with all your information. The usage instruction of the app can be referred to [this tuitorial](https://www.youtube.com/watch?v=DtzMie4U8RM).

In case you want to explore it by Python, try to take a look at **nfcpy** library ([Github](https://github.com/nfcpy/nfcpy), [PyPi](https://pypi.org/project/nfcpy/), [Docs](https://nfcpy.readthedocs.io/en/latest/topics/snep.html)). 

```
That's all. Now you can tap your card everywhere and share your information to others without saying a word. Test it and enjoy yourself!
```