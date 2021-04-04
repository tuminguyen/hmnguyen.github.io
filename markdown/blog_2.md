This blog will be the continue part of the [ELK stack installation](https://tuminguyen.github.io/hmnguyen.github.io/blog_detail.html?id=1). In this blog, we will go through how to install and using Logstash as well as Filebeat 


### Install Logstash

Logstash is a data collection engine that will gather the data from different sources regardless the structure. To be more specified, it welcomes all kind of data, ingests the data of all shapes, parses and transforms them into a wish format before pushing into the stash (Elasticsearch, S3, Mongo,etc.,) for later use _(for example: searching)_. Hereby, we are talking about Elasticsearch because we will use the data for visualization and analysis on Kibana.

To install, run:

```bash
sudo apt-get install logstash

```

Now, enable and start using it
```
sudo systemctl enable logstash
sudo systemctl start logstash
```

You can  freely configure the _input_, _filter_ and _output_ of the logstash pipeline as you want by creating or accessing the file in here ```/etc/logstash/conf.d/```. Please visit [this example](https://www.elastic.co/guide/en/logstash/7.0/config-examples.html) to customize your configuration.

### Install Filebeat

Beats can be considered as a lightweight shipper version for Logstash and Filebeat is just one member of the Beats family. 

Basically, Beats helps you keep things simple by offering a lightweight way to pumps the logs either to Elasticsearch or Logstash for aggregation and enrichment. It has a small footprint and use fewer system resources than Logstash. However, both Filebeat and Logstash can be primarily classified as "Log Management" tools. 

The relationship between the two log shippers can be better understood in the following diagram:

![relationship](../image/beats-logstash.png)

**When to use which**

In practice, we need to use both Filebeat and Logstash and it's all up to the use case. 

<ins>_For example:_<inss>

- When collect the logs on the same machine -> use Logstash. Otherwise, Filebeat as it needs less resource when gathering data froom remote machine than Logstash.

- You can send the data to Logstash if you still need to make more transformations on your data. Otherwise, you are able to send it directly from Beats to Elasticsearch.

- Filebeat will resend the logs when the logstash instance is down, so you won't loose any log by using Filebeat.

For more information about Logstash and different types of Beats, please check out [Logtash](https://www.elastic.co/guide/en/logstash/current/introduction.html) and [Beats](https://www.elastic.co/guide/en/beats/libbeat/current/beats-reference.html).


To install Filebeat, use:
```
sudo atp-get install filebeat
``` 

After the command finished, we need to make some changes in configuration to make Filebeat can send data to Logstash. 

Follow these steps:

1. Access the yaml file
``` 
sudo nano /etc/filebeat/filebeat.yml
```

2. Comment these 2 lines under **Elasticsearch Output** section

    *Before:*
    ```
    # ---------------------------- Elasticsearch Output ----------------------------
    output.elasticsearch:
    # Array of hosts to connect to.
    hosts: ["localhost:9200"]

    ```
    *After:*

    ```
    # ---------------------------- Elasticsearch Output ----------------------------
    #output.elasticsearch:
    # Array of hosts to connect to.
    #hosts: ["localhost:9200"]
    ```

3. Uncomment these 2 lines under **Logstash Output** section

    *Before:*
    ```
    # ------------------------------ Logstash Output -------------------------------
    #output.logstash:
    # The Logstash hosts
    #hosts: ["localhost:5044"]
    ```

    *After:*
    ```
    # ------------------------------ Logstash Output -------------------------------
    output.logstash:
    # The Logstash hosts
    hosts: ["localhost:5044"]
    ```

Save and quit the file, using ```Ctrl + x ``` then ```y``` then ```Enter```.

Now, let's enable the filebeat system with ```sudo```.

```
sudo filebeat modules enable system
```

You will see the system return something like this:
```
Enabled system
```

Before we enable the service, an important step that is needed to get done is to load and setup the index. 

```
sudo filebeat setup --index-management -E output.logstash.enabled=false -E 'output.elasticsearch.hosts=["localhost:9200"]'
```

Wait for the system to return:

```
Overwriting ILM policy is disabled. Set `setup.ilm.overwrite: true` for enabling.

Index setup finished.
```

**Notes:** Remember to run your Elasticsearch and Kibana service during this process. Otherwise you will get some unexpected errors like this.

```
Exiting: couldn't connect to any of the configured Elasticsearch hosts. Errors: [error connecting to Elasticsearch at http://localhost:9200: Get "http://localhost:9200": dial tcp 127.0.0.1:9200: connect: connection refused]
```

Finally, enable and start the Filebeat service on your local
```
sudo systemctl enable filebeat

sudo systemctl enable filebeat

```

**Check if it works**

To check if everything is in order now, just list out the indices in the elasticsearch cluster.

```
curl -XGET http://localhost:9200/_cat/indices?v
```

You will see there is an index from Filebeat. At this point, you can be sure that the Filebeat has sucessfully sent the data to Logstash then store in Elasticsearch.

```
health status index                             uuid                   pri rep docs.count docs.deleted store.size pri.store.size

green  open   .kibana_task_manager_7.12.0_001   UqUAvBGwQWmRPT6jkrWrsg   1   0          9           58    117.3kb        117.3kb
yellow open   aloha                             18y5FAtORkiW3fbc-MAb9A   1   1          0            0       208b           208b
green  open   .apm-custom-link                  F0Nx4_BJTTyx2NnDI250_g   1   0          0            0       208b           208b
green  open   .kibana-event-log-7.11.2-000001   r8U7TjBmQKmtcB_ndoUxXg   1   0          9            0     48.8kb         48.8kb
green  open   .kibana_task_manager_1            aC1GHYeJQzOkEmf7R1K45g   1   0          8          547    133.9kb        133.9kb
green  open   .apm-agent-configuration          akBIf1qKTU-ZInRMjB1Qgw   1   0          0            0       208b           208b
yellow open   employees                         SFD3AW8ORROl7CLciqcFEw   1   1          5            0     29.9kb         29.9kb
green  open   .kibana_1                         WOqt6es8T4CHUesmJ1RHqQ   1   0         44           45      2.1mb          2.1mb
green  open   .kibana-event-log-7.12.0-000001   3segqpJTSBOaUuCGlqMb-g   1   0          1            0      5.5kb          5.5kb
green  open   .kibana_7.12.0_001                OCjNJmHORZWQE0tzoVqkow   1   0         45            2      4.2mb          4.2mb
yellow open   filebeat-7.12.0-2021.04.04-000001 5vYLR5UyQ12XqjcgdGa-Ug   1   1       2998            0    583.7kb        583.7kb
green  open   .tasks                            ZaB0Nw71TEOmeOhSsVOulw   1   0          4            0     26.9kb         26.9kb

```

You can use ```grep``` command to find the index easier
```
curl -XGET http://localhost:9200/_cat/indices?v | grep filebeat
```

Then you should receive something like this.
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1677  100  1677    0     0  55900      0 --:--:-- --:--:-- --:--:-- 57827
yellow open   filebeat-7.12.0-2021.04.04-000001 5vYLR5UyQ12XqjcgdGa-Ug   1   1      26058            0      2.9mb          2.9mb
```

**_Alright, seem like everything is done! See you in the next blog._**


### References

[How to install ELK stack on Ubuntu](https://phoenixnap.com/kb/how-to-install-elk-stack-on-ubuntu)

[Logstash or Beats](https://www.elastic.co/guide/en/beats/filebeat/current/diff-logstash-beats.html)

[Logstash vs Beats. The differences?](https://logz.io/blog/filebeat-vs-logstash/)

[Logstash configuration example](https://www.elastic.co/guide/en/logstash/7.0/config-examples.html)
