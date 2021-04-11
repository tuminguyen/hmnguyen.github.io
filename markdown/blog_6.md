Have you just came here from [this blog](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=5)? If yes, then welcome to the next step in the exploring ELK stack series. In case this is the first time you are here, I would recommend you to go back and read the [prior blog](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=5) to get the basis first.

In this week tutorial, we will try to scrap some logs and visualize it real time on Kibana. Sounds COOL, right? :satisfied:

**LET'S GET STARTED.**

If you are still remember about Logstash and Filebeat, which are discussed in [this post](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=2), you will see it clearly on how power the Logstash is and many advantages that come from Filebeat. 

According to that, hereby, we will try to crawl the Nginx logs with Filebeat, store it in our Elasticsearch cluster and visualize it lively in Kibana.

All the process will be executed on node-4, the one that ingest the events and not participating as data or master node. This post will be so easy to follow and implement. 

# Set up

First open your terminal and ssh to the 4th node.
```
ssh ubuntu@193.167.189.62 -i .ssh/myPoutaKey.pem    # change 193.167.189.62 with the public IP of node 4 in your cluster
```

Once sucessfully login, you need to install Filebeat to start crawling logs.

You can totally install it in the way that I have introduced in [this blog](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=2). However, I <span style="color: rgb(204, 45, 71); font-weight:bold">highly recommend</span> you to follow the steps in here because it is more straight forward and fit to our process on multiple nodes cluster.

At the end of the previous post, we are already access the Kibana Interface on browser via the public IP. It should be something like this.

![kibana-ui](../image/kibana-work.png)

Now, click on **Try our sample data** to play around with Kibana using some existed samples. 

![kibana-sample](../image/kibana-sample-dat.png)

Switch to **Logging** tab to discover many type of logs that Kibana already integrated.

![kibana-sample-log](../image/kibana-sample-log.png)

Click on **Nginx logs** and it will redirect you to a [detail setup page](http://193.167.189.62/app/kibana#/home/tutorial/nginxLogs?_g=()), which looks something like:

![kibana-nginx-logs](../image/kibana-nginx-setup.png)

Freely choose the OS you are using, in here, I switch the instruction for the Debian tab **(DEB)**.

![kibana-nginx-logs](../image/kibana-nginx-setup-deb.png)

From here, you just need to go ahead, copy the commands manually and paste them on your terminal. Or, you can also copy the instruction commands by clicking the **Copy snipnet** button over each script. After following all along, you will easily install the Filebeat, configure it correctly and scrap the log without any errors.

In case you are struggling with *configuring the yaml file* by the original instruction _(step 2)_, here is some illustration to make it more clear.

1. Open the config file
    ```
    sudo nano /etc/filebeat/filebeat.yml
    ```
2. Make some change in these following lines
    ```
    # scroll down and find Kibana section

    #==============================Kibana=====================================
    ...
    setup.kibana:
        ....
        #host: "localhost:5601"     # uncomment this line and change localhost with your hostname -I value

    # scroll and find Elasticsearch output section
    #-------------------------- Elasticsearch output ------------------------------
    output.elasticsearch:
        # Array of hosts to connect to.
        hosts: ["localhost:9200"]       # change localhost to your hostname -I value

    # For username and password configure, you can pass or set it for yourself. In here, I pass.
    ```

    Save and quit the file, using ```Ctrl + x``` then ```y``` then ```Enter```.
    
The setup in step 4 will take you some times (~ 1-2 mins) to finish. 

Enable the service and check for data recieved by clicking the **Check data** button on the final step.

![nginx-log-check](../image/kibana-nginx-log-check.png)

If you see something like the above image, let's celebrate cuz everything until now is in its order.

# See the log

To see the real-time log, just click on **Discover** icon, which is the first one on the left menu. You can refresh the page to see the new events that Nginx module has imported to Elasticsearch and save it under the **filebeat** index _(filebeat is the name of the index)_.

You can check for the available indices in Elasticsearch by typing:
```
curl node-4:9200/_cat/indices
```
the system will then return:

```
green open filebeat-7.0.1-2021.04.05-000001 Dt6LUWG4SlOz9NG5r5_RgA 1 1 516  0 804.4kb 429.3kb
green open .kibana_1                        8aTthMvLT3WsvvaENsXPcA 1 1 613 35 819.4kb 419.1kb

```

![nginx-discover](../image/kibana-nginx-log-discover.png)

The events here are not 100% real-time but they still have a small delay like 1 minute before displaying for you on Kibana.


# Discover the dashboard

To manage your own dashboard, click on **Dashboard** icon on the left menu _(the 3rd one)_. 

In here, you can create a new one or reference one of the old templates then customize it to your style. You can also search for the specific keyword like the log you are trying to visualize.

![dashboard](../image/search-nginx-dashboard.png)

Just click on one of them to see.

![templates-dash](../image/template-dashboard.png)

You can freely change the time range or period to plot. Once you do that, all the graphs will be redrawn then displayed. Another way to make the graph looks more lively is to change the refresh rate on Kibana and create some dummies data.

So, to create some fake log, install **hey**

```
sudo snap install hey
```

By using snap, it will auto finds the most stable version that is fit to your current OS.

Now, seem like the fake requests have been made by hey. You can see the graph updated like
![hey-1](../image/nginx-fake.gif)


Let's just make it more challenging by sending more requests to the node then see what the graph should look like. Use the following command:

```
hey -n number_of_requests_in_total -c number_of_request_run_concurrently_ -q rate_limit target_url 
```
_Example:_

```
# Sending 100k requests with 10 requests per 1 second to http://193.167.189.62

hey -n 100000 -c 10 -q 1 http://193.167.189.62
```

Type ```--help``` for more usage instruction.

```
hey --help
```


Well, below here is an embedded live dashboard that doing some statistics on the Remote IPs _(from my Nginx system log)_. You can freely interact with it.

<iframe src="https://livelyfreakonearth.ml/app/kibana#/dashboard/412b34f0-9ab9-11eb-86f8-a73e24150a95?embed=true&_g=(refreshInterval:(pause:!t,value:0),time:(from:now%2FM,to:now%2FM))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),panels:!((embeddableConfig:(mapCenter:!(59.79992830992723,77.8767075),mapZoom:3),gridData:(h:18,i:'1',w:48,x:0,y:0),id:'6eee67f0-9ab8-11eb-86f8-a73e24150a95',panelIndex:'1',title:'Remote+IP+NGINX+map',type:visualization,version:'7.0.1'),(embeddableConfig:(),gridData:(h:17,i:'2',w:29,x:0,y:18),id:c5ee1080-9aba-11eb-86f8-a73e24150a95,panelIndex:'2',type:visualization,version:'7.0.1'),(embeddableConfig:(),gridData:(h:17,i:'3',w:19,x:29,y:18),id:'0c99d770-9abc-11eb-86f8-a73e24150a95',panelIndex:'3',type:visualization,version:'7.0.1')),query:(language:kuery,query:''),timeRestore:!f,title:'My+Nginx+Dashboard',viewMode:edit)" height="600" width="1150"></iframe>

To share your specific dashboard to your friends, colleagues or any others, you must make your Kibana's access URL to be a real domain by using [Freenom](https://www.freenom.com/en/index.html?lang=en). It is free up to 12 months. You also need to install [Certbot](https://certbot.eff.org/), choose the proper _software_ and _system_ and just follow the steps to make your website more secured by changing from HTTP to HTTPS. Just like this.

![certbot](../image/site-lfoe.png)

**Notes:** Your friends might be asked about the access information. In here, as I already create a new account for all of you guys so just slap in my face an email and I will send you the user and password.

As the Nginx is a kind of system log, which is not so easy to understand and analyse for the . Hence, in the [next blog](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=7), we will try to analyze and aggregate the data with Elasticsearch and **manually** customise the dashboard with the [kaggle terrorism data](https://www.kaggle.com/START-UMD/gtd).