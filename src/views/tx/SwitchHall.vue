<template>
    <div class="switch-hall bg-gray">
        <div class="bg-white">
            <div class="title font24 w1200">
                <SelectTokenBar @change="changeTokenType"></SelectTokenBar>
            </div>
        </div>
        <div class="top w1200">
            <div class="order">
                <!-- 买入挂单 -->
                <div class="top-left fl">
                    <el-form :model="buyTokenOrderForm" :rules="buyTokenOrderRules" ref="buyTokenOrderForm">
                    <h3 class="tabs_title tabs_header capitalize">{{$t('switch.myWantBuy')}}</h3>
                    <div class="order_left">
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.price')}}：</span></div>
                            <div class="order_input">
                                <el-form-item prop="price">
                                    <el-input type="input" v-model="buyTokenOrderForm.price" :placeholder="$t('switch.nullPrice')"></el-input>
                                </el-form-item>
                            </div>
                            <div class="order_span"><span>{{toTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.num')}}：</span></div>
                            <div class="order_input">
                                <el-form-item prop="totalNum">
                                    <el-input type="input" v-model="buyTokenOrderForm.totalNum" :placeholder="$t('switch.nullTxNum')"></el-input>
                                </el-form-item>
                            </div>
                            <div class="order_span"><span>{{fromTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.usable')}}：</span></div>
                            <div class="order_label"><span>100</span></div>
                            <div class="order_label"><span>{{toTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_btn_row">
                            <el-button type="primary" @click="submitCreateOrder('buyTokenOrderForm',1)">{{$t('switch.buy')}}</el-button>
                        </el-row>
                    </div>
                    </el-form>
                </div>
                <!-- 买出挂单 -->
                <div class="top-left fl">
                    <el-form :model="sellTokenOrderForm" :rules="sellTokenOrderRules" ref="sellTokenOrderForm">
                    <h3 class="tabs_title tabs_header capitalize">{{$t('switch.myWantSell')}}</h3>
                    <div class="order_left">
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.price')}}：</span></div>
                            <div class="order_input">
                                <el-form-item prop="price">
                                    <el-input type="input" v-model="sellTokenOrderForm.price" :placeholder="$t('switch.nullPrice')"></el-input>
                                </el-form-item>
                            </div>
                            <div class="order_span"><span>{{toTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.num')}}：</span></div>
                            <div class="order_input">
                                <el-form-item prop="totalNum">
                                    <el-input type="input" v-model="sellTokenOrderForm.totalNum" :placeholder="$t('switch.nullTxNum')"></el-input>
                                </el-form-item>
                            </div>
                            <div class="order_span"><span>{{fromTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_row">
                            <div class="order_label"><span>{{$t('orderInfo.usable')}}：</span></div>
                            <div class="order_label"><span>1000</span></div>
                            <div class="order_label"><span>{{fromTokenSymbol}}</span></div>
                        </el-row>
                        <el-row class="order_btn_row">
                            <el-button type="primary" @click="submitCreateOrder('sellTokenOrderForm',2)">{{$t('switch.sell')}}</el-button>
                        </el-row>
                    </div>
                    </el-form>
                </div>
            </div>
            <!-- 挂单列表 -->
            <div class="top-right fr">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="$t('switch.myWantBuy')" name="buyTab">
                        <el-table :data="buyList" stripe border style="width: 100%;" class="mt_0"
                                  v-loading="buyListLoading">
                            <el-table-column label="" width="30">
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.price }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.totalNum }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('switch.buy')" width="120" align="left">
                                <template slot-scope="scope"><el-button type="primary" @click="buyBtnClick(scope.row.orderId)">{{$t('switch.buy')}}</el-button></template>
                            </el-table-column>
                        </el-table>
                        <div class="paging">
                            <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                           v-show="buyListPager.total > sellListPager.rows"
                                           :total="buyListPager.total"
                                           :current-page.sync="buyListPager.page"
                                           :pager-count=5
                                           :page-size="buyListPager.rows" @current-change="pagesBuyList">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane :label="$t('switch.myWantSell')" name="sellTab">
                        <el-table :data="sellList" stripe border style="width: 100%;" class="mt_0"
                                  v-loading="sellListLoading">
                            <el-table-column label="" width="30">
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.price }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
                                <template slot-scope="scope">{{ scope.row.totalNum }}</template>
                            </el-table-column>
                            <el-table-column :label="$t('switch.sell')" width="120" align="left">
                                <template slot-scope="scope"><el-button type="primary" @click="sellBtnClick(scope.row.orderId)">{{$t('switch.sell')}}</el-button></template>
                            </el-table-column>
                        </el-table>
                        <div class="paging">
                            <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                           v-show="sellListPager.total > sellListPager.rows"
                                           :total="sellListPager.total"
                                           :current-page.sync="sellListPager.page"
                                           :pager-count=5
                                           :page-size="sellListPager.rows" @current-change="pagesSellList">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="cb"></div>
        <!-- 当前委托列表 -->
        <div class="bottoms w1200 cb">
            <el-tabs v-model="depositActiveName">
                <el-tab-pane :label="$t('switch.currentDeposit')" name="depositTab">
                    <el-table :data="depositList" stripe border class="mt_0 el-deposit-table"
                              v-loading="depositListLoading">
                        <el-table-column label="" width="30">
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.createTime')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.createTime }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.txType')" width="120" align="left">
                            <template slot-scope="scope">
                                <span v-if="scope.row.txType ==1">{{$t('switch.buy')}}</span>
                                <span v-else>{{$t('switch.sell')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.tokenPair')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.tokenPair }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.price }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.txNum }}/{{ scope.row.totalNum }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.totalAmount')" width="170" align="left">
                            <template slot-scope="scope">{{ scope.row.totalAmount }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderInfo.status')" width="180" align="left">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="cancelOrderClick(scope.row.orderId)">取消</el-button>
                                <span v-if="scope.row.status==1"> | </span>
                                <el-button type="text" size="mini" @click="getOrderTradeClick(scope.row.orderId)" v-if="scope.row.status==1">确认</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="paging">
                        <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                       v-show="depositListPager.total > depositListPager.rows"
                                       :total="depositListPager.total"
                                       :current-page.sync="depositListPager.page"
                                       :pager-count=5
                                       :page-size="depositListPager.rows" @current-change="pagesDepositList">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 买入/卖出 -->
        <el-dialog title="买入" :visible.sync="buyTokenVisible" top="30vh" width="20rem"
                   class="password-dialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   @close="buyTokenFormClose">
<!--            :rules="buyTokendRules" @submit.native.prevent-->
            <el-form ref="buyTokenForm" :model="buyTokenForm">
                <el-form-item prop="txNum">
                </el-form-item>
                <div class="buyToken">
                    <el-row class="order_row">
                        <div class="order_label"><span>{{$t('orderInfo.num')}}：</span></div>
                        <div class="order_input">
                            <el-input type="input" v-model="buyTokenForm.txNum" :maxlength="10" placeholder="请输入数量"></el-input>
                        </div>
                    </el-row>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer1">
                <el-button @click="buyTokenFormClose">取 消</el-button>
                <el-button type="primary" @click="txOrderSubmit('buyTokenForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="卖出" :visible.sync="sellTokenVisible" top="30vh" width="20rem"
                   class="password-dialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   @close="sellTokenFormClose">
            <!--            :rules="buyTokendRules" @submit.native.prevent-->
            <el-form ref="sellTokenForm" :model="sellTokenForm">
                <el-form-item prop="txNum">
                </el-form-item>
                <div class="buyToken">
                    <el-row class="order_row">
                        <div class="order_label"><span>{{$t('orderInfo.num')}}：</span></div>
                        <div class="order_input">
                            <el-input type="input" v-model="sellTokenForm.txNum" :maxlength="10" placeholder="请输入数量"></el-input>
                        </div>
                    </el-row>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer1">
                <el-button @click="sellTokenFormClose">取 消</el-button>
                <el-button type="primary" @click="txOrderSubmit('sellTokenForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 订单交易详情列表 -->
        <el-dialog title="订单交易详情" :visible.sync="orderTradeVisible" top="30vh"
                   class="order-trade-dialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   @close="orderTradeFormClose">
            <el-form ref="orderTradeForm">
                <el-table :data="tradeList" stripe border class="mt_0 el-deposit-table"
                          v-loading="tradeListLoading">
                    <el-table-column label="" width="30">
                    </el-table-column>
                    <el-table-column :label="$t('orderInfo.createTime')" width="170" align="left">
                        <template slot-scope="scope">{{ scope.row.createTime }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('orderInfo.price')" width="150" align="left">
                        <template slot-scope="scope">{{ scope.row.price }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('orderInfo.num')" width="150" align="left">
                        <template slot-scope="scope">{{ scope.row.txNum }}</template>
                    </el-table-column>
                    <el-table-column :label="$t('orderInfo.status')" width="150" align="left">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status==1"> 确认中 </span>
                            <el-button type="primary" size="mini" @click="confirmOrderClick(scope.row.txId)" v-if="scope.row.status==0 && scope.row.status!=9">确认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="paging">
                    <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                                   v-show="tradeListPager.total > tradeListPager.rows"
                                   :total="tradeListPager.total"
                                   :current-page.sync="tradeListPager.page"
                                   :pager-count=5
                                   :page-size="tradeListPager.rows" @current-change="pagesTradeList">
                    </el-pagination>
                </div>
            </el-form>
        </el-dialog>

        <!-- 用于在不同功能输入密码 -->
        <!-- 买入/卖出挂单 -->
        <Password ref="createOrderPassword" @passwordSubmit="createOrderPassSubmit">
        </Password>
        <!-- 买入/卖出交易 -->
        <Password ref="txOrderPassword" @passwordSubmit="txOrderPassSubmit">
        </Password>
        <!-- 取消挂单 -->
        <Password ref="cancelOrderPassword" @passwordSubmit="cancelOrderPassSubmit">
        </Password>
        <!-- 确认交易 -->
        <Password ref="confirmOrderPassword" @passwordSubmit="confirmOrderPassSubmit">
        </Password>
    </div>
</template>

<script>
    import nuls from 'nuls-sdk-js'
    import Password from '@/components/PasswordBar'
    import SelectTokenBar from '@/components/SelectTokenBar'
    import {chainID, timesDecimals, multiDecimals} from '@/api/util.js'
    import {createOrder,tradingOrder,cancelOrder,confirmOrder,getOrderDetail} from '@/api/requestData'
    //import moment from 'moment'

    export default {
        data() {
            let validatePrice = (rule, value, callback) => {
                let re = /^\d+(?=\.{0,1}\d+$|$)/;
                let res = /^\d{1,8}(\.\d{1,8})?$/;
                if (!value) {
                    callback(new Error(this.$t('switch.nullPrice')));
                } else if (!re.exec(value) || !res.exec(value)) {
                    callback(new Error(this.$t('switch.mustNum')));
                } else if (value <= 0) {
                    callback(new Error(this.$t('switch.mustNotZero')));
                } else {
                    callback();
                }
            };
            let validateTxNum = (rule, value, callback) => {
                let re = /^\d+(?=\.{0,1}\d+$|$)/;
                let res = /^\d{1,8}(\.\d{1,8})?$/;
                if (!value) {
                    return callback(new Error(this.$t('switch.nullTxNum')));
                } else if (!re.exec(value) || !res.exec(value)) {
                    callback(new Error(this.$t('switch.mustNum')));
                } else if (value < 0) {
                    callback(new Error(this.$t('switch.txNumError')));
                } else {
                    callback();
                }
            };
            return {
                fromTokenId: '',
                toTokenId: '',
                fromTokenSymbol: '',
                toTokenSymbol: '',
                balanceInfo: {},//账户余额信息
                accountAddress: JSON.parse(localStorage.getItem('accountInfo')),
                buyTokenOrderForm: {
                    price: '',
                    totalNum: '',
                },
                sellTokenOrderForm: {
                    price: '',
                    totalNum: '',
                },
                buyTokenForm: {
                    txNum: ''
                },
                sellTokenForm: {
                    txNum: ''
                },
                buyTokenVisible: false,
                sellTokenVisible: false,
                orderTradeVisible: false,
                isMobile: true,
                activeName: 'buyTab',
                depositActiveName: 'depositTab',
                //交易类型
                txType: 0,
                //交易数量
                txNum: 0,
                //订单ID
                orderId: '',
                //订单交易ID
                txId: '',
                //地址
                address: localStorage.getItem('accountInfo') != null ? JSON.parse(localStorage.getItem('accountInfo')).address : '',
                //可买挂单列表
                buyList: [],
                //可买挂单列表分页信息
                buyListPager: {
                    total: 0,
                    page: 1,
                    rows: 2,
                },
                //可买挂单列表加载动画
                buyListLoading: true,
                //可卖挂单列表
                sellList: [],
                //可卖挂单列表分页信息
                sellListPager: {
                    total: 0,
                    page: 1,
                    rows: 2,
                },
                //可卖挂单列表加载动画
                sellListLoading: true,
                //当前委托列表
                depositList: [],
                //当前委托列表分页信息
                depositListPager: {
                    total: 0,
                    page: 1,
                    rows: 5,
                },
                //当前委托列表加载动画
                depositListLoading: true,

                //订单交易列表
                tradeList: [],
                //订单交易列表分页信息
                tradeListPager: {
                    total: 0,
                    page: 1,
                    rows: 5,
                },
                //订单交易列表加载动画
                tradeListLoading: true,
                //地址定时器
                addressInterval: null,
                buyTokenOrderRules: {
                    price: [
                        {validator: validatePrice, trigger: ['blur']},
                    ],
                    totalNum: [
                        {validator: validateTxNum, trigger: ['blur']}
                    ]
                },
                sellTokenOrderRules:{
                    price: [
                        {validator: validatePrice, trigger: ['blur']},
                    ],
                    totalNum: [
                        {validator: validateTxNum, trigger: ['blur']}
                    ]
                }
            }
        },
        components: {
            SelectTokenBar,
            Password
        },
        created() {
            this.isMobile = /(iPhone|iOS|Android|Windows Phone)/i.test(navigator.userAgent);
            //this.getAddressInfo(this.address);
            this.pagesBuyList();
            this.pagesDepositList();
        },
        mounted() {
            //延迟加载饼状图
            setTimeout(() => {
                // this.chartData = {
                //     columns: ['location', 'value'],
                //     rows: this.addressNumber
                // };
            }, 500);

            //定时获取地址
            // this.addressInterval = setInterval(() => {
            //     //this.address = this.$route.query.address;
            // }, 500);
        },
        beforeDestroy() {
            //离开界面清除定时器
            if (this.addressInterval) {
                clearInterval(this.addressInterval);
            }
        },
        methods: {
            /**
             * 买入/卖出挂单提交
             * @param formName
             **/
            async submitCreateOrder(formName,txType) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.txType=txType;
                        this.$refs.createOrderPassword.showPassword(true);
                    } else {
                        return false;
                    }
                });
            },
            /**
             *  创建挂单，获取密码框的密码
             * @param password
             **/
            async createOrderPassSubmit(password) {
                const pri = nuls.decrypteOfAES(this.accountAddress.aesPri, password);
                const newAddressInfo = nuls.importByKey(chainID(), pri, password);
                let price=this.txType == 1 ? this.buyTokenOrderForm.price : this.sellTokenOrderForm.price;
                let totalNum=this.txType == 1 ? this.buyTokenOrderForm.totalNum : this.sellTokenOrderForm.totalNum

                if (newAddressInfo.address === this.accountAddress.address) {
                    // 创建订单提交
                    let params = {
                        "txType": this.txType,
                        "address": newAddressInfo.address,
                        "fromTokenId": this.fromTokenId,
                        "toTokenId": this.toTokenId,
                        "price": multiDecimals(price, 8),
                        "totalNum": multiDecimals(totalNum, 8)
                    };
                    await createOrder(params).then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.buyTokenOrderForm.price = '';
                            this.buyTokenOrderForm.totalNum = '';
                            this.sellTokenOrderForm.price = '';
                            this.sellTokenOrderForm.totalNum = '';
                            // 重新加载当前委托
                            this.pagesDepositList();
                            this.$message({message: this.$t('switch.createOrderSuccess'), type: 'success', duration: 1000});
                        } else {
                            this.$message({message: this.$t('switch.createOrderError') + response.data, type: 'error', duration: 1000});
                        }
                    }).catch((err) => {
                        this.$message({message: this.$t('switch.createOrderError') + err, type: 'error', duration: 1000});
                    });
                }else {
                    this.$message({message: this.$t('public.errorPwd'), type: 'error', duration: 1000});
                }
            },

            /**
             * 获地址详细信息
             */
            //getAddressInfo(address) {
                // this.$post('/', 'getAccount', [address])
                //     .then((response) => {
                //         //console.log(response);
                //         if (response.hasOwnProperty("result")) {
                //             response.result.totalBalance = timesDecimals(response.result.totalBalance, 8);
                //             response.result.balances = timesDecimals(response.result.balance, 8);
                //             response.result.totalLock = Plus(response.result.timeLock, response.result.consensusLock).toString();
                //             response.result.totalLocks = timesDecimals(response.result.totalLock, 8);
                //             response.result.timeLock = timesDecimals(response.result.timeLock, 8);
                //             response.result.consensusLock = timesDecimals(response.result.consensusLock, 8);
                //             response.result.totalIn = timesDecimals(response.result.totalIn, 8);
                //             response.result.totalOut = timesDecimals(response.result.totalOut, 8);
                //
                //             if (parseInt(response.result.balance) > 0) {
                //                 this.addressNumber.push({
                //                     location: this.$t('public.usablebalance'),
                //                     value: parseInt(timesDecimals(response.result.balance, 8))
                //                 });
                //             }
                //             if (parseInt(response.result.totalLock) > 0) {
                //                 this.addressNumber.push({
                //                     location: this.$t('public.consensusLocking'),
                //                     value: parseInt(timesDecimals(response.result.totalLock, 8))
                //                 });
                //             }
                //
                //             //循环代币
                //             for (let item in response.result.tokens) {
                //                 this.tokenOptions[item] = response.result.tokens[item].split(',');
                //             }
                //             this.tokenOptions.unshift(["", this.$t('type.0')]);
                //             this.addressInfo = response.result;
                //         }
                //     })
            //},

            /**
             * tab 选项
             **/
            handleClick(tab) {
                this.activeName = tab.name;
                if (tab.name === 'buyTab') {
                    // 查询可买挂单列表
                    this.buyListLoading = true;
                    this.pagesBuyList();
                } else if (tab.name === 'sellTab') {
                    console.log("this.address:  " + this.address);
                    // 查询可卖挂单列表
                    this.sellListLoading = true;
                    this.pagesSellList();
                }
            },

            /**
             * 点击买入按钮，弹出购买框
             */
            buyBtnClick(orderId){
                this.orderId = orderId;
                this.buyTokenVisible = true;
            },

            /**
             * 点击买出按钮，弹出卖出框
             */
            sellBtnClick(orderId) {
                this.orderId = orderId;
                this.sellTokenVisible = true;
            },

            // 关闭买入窗口
            buyTokenFormClose() {
                this.$refs['buyTokenForm'].resetFields();
                this.buyTokenVisible = false;
            },
            // 关闭卖出窗口
            sellTokenFormClose() {
                this.$refs['sellTokenForm'].resetFields();
                this.sellTokenVisible = false;
            },

            // 点击确定买卖后，弹出密码输入框
            txOrderSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(formName=='buyTokenForm')
                        {
                            this.txNum=this.buyTokenForm.txNum;
                            this.buyTokenVisible = false;
                        }
                        if(formName=='sellTokenForm')
                        {
                            this.txNum=this.sellTokenForm.txNum;
                            this.sellTokenVisible = false;
                        }
                        this.$refs.txOrderPassword.showPassword(true);
                    } else {
                        return false
                    }
                })
            },
            /**
             *  确定买卖，获取密码框的密码
             * @param password
             **/
            async txOrderPassSubmit(password) {
                const pri = nuls.decrypteOfAES(this.accountAddress.aesPri, password);
                const newAddressInfo = nuls.importByKey(chainID(), pri, password);
                if (newAddressInfo.address === this.accountAddress.address) {
                    // 买卖TOKEN提交
                    let params = {
                        "address": newAddressInfo.address,
                        "orderId": this.orderId,
                        "txNum": multiDecimals(this.txNum, 8)
                    };
                    await tradingOrder(params).then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.buyTokenForm.txNum = '';
                            this.sellTokenForm.txNum = '';
                            this.$message({message: this.$t('switch.tradingOrderSuccess'), type: 'success', duration: 1000});
                        } else {
                            this.$message({message: this.$t('switch.tradingOrderError') + response.data, type: 'error', duration: 1000});
                        }
                    }).catch((err) => {
                        this.$message({message: this.$t('switch.tradingOrderError') + err, type: 'error', duration: 1000});
                    });
                }else {
                    this.$message({message: this.$t('public.errorPwd'), type: 'error', duration: 1000});
                }
            },

            /**
             *  取消订单，获取密码框的密码
             * @param orderId
             **/
            cancelOrderClick(orderId) {
                this.orderId = orderId;
                this.$refs.cancelOrderPassword.showPassword(true);
            },
            /**
             *  取消订单提交
             * @param password
             **/
            async cancelOrderPassSubmit(password) {
                const pri = nuls.decrypteOfAES(this.accountAddress.aesPri, password);
                const newAddressInfo = nuls.importByKey(chainID(), pri, password);
                if (newAddressInfo.address === this.accountAddress.address) {
                    // 取消订单提交
                    let params = {
                        "orderId": this.orderId
                    };
                    await cancelOrder(params).then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.orderId = '';
                            this.$message({message: this.$t('switch.cancelOrderSuccess'), type: 'success', duration: 1000});
                        } else {
                            this.$message({message: this.$t('switch.cancelOrderError') + response.data, type: 'error', duration: 1000});
                        }
                    }).catch((err) => {
                        this.$message({message: this.$t('switch.cancelOrderError') + err, type: 'error', duration: 1000});
                    });
                }else {
                    this.$message({message: this.$t('public.errorPwd'), type: 'error', duration: 1000});
                }
            },

            /**
             *  关闭订单交易明细窗口
             **/
            orderTradeFormClose() {
                this.$refs['orderTradeForm'].resetFields();
                this.orderTradeVisible = false;
            },
            /**
             *  查询订单交易记录列表
             * @param orderId
             **/
            async getOrderTradeClick(orderId) {
                this.orderId = orderId;
                // let params = {
                //     "orderId": this.orderId
                // };
                // 查询订单交易记录
                this.pagesTradeList(orderId);
            },
            /**
             * 订单交易列表 分页
             */
            async pagesTradeList(orderId){
                let params = {"current":  this.tradeListPager.page, "pageSize": this.tradeListPager.rows, "orderId": orderId};
                await getOrderDetail(params).then((response) => {
                    console.log(response);
                    if (response.success) {
                        // 展示订单交易详情
                        for (let item of response.data.records) {
                            //item.price = timesDecimals(item.price, 8);
                            item.txNum = timesDecimals(item.txNum, 8);
                            item.totalNum = timesDecimals(item.totalNum, 8);
                        }
                        this.tradeList = response.data.records;
                        this.tradeListPager.total = response.data.total;
                        this.tradeListLoading = false;
                        this.orderTradeVisible = true;
                        //this.$message({message: this.$t('switch.getOrderTradeSuccess'), type: 'success', duration: 1000});
                    } else {
                        this.$message({message: this.$t('switch.getOrderTradeError') + response.data, type: 'error', duration: 1000});
                    }
                }).catch((err) => {
                    this.$message({message: this.$t('switch.getOrderTradeError') + err, type: 'error', duration: 1000});
                });
            },

            /**
             *  确认订单，获取密码框的密码
             * @param orderId
             **/
            confirmOrderClick(txId) {
                this.txId = txId;
                this.$refs.confirmOrderPassword.showPassword(true);
            },
            /**
             *  确认订单提交，该操作数据会上链
             * @param password
             **/
            async confirmOrderPassSubmit(password) {
                const pri = nuls.decrypteOfAES(this.accountAddress.aesPri, password);
                const newAddressInfo = nuls.importByKey(chainID(), pri, password);
                if (newAddressInfo.address === this.accountAddress.address) {
                    // 组装交易数据上链 TODO
                    let txHash='123';
                    // 确认订单提交
                    let params = {
                        "txId": this.txId,
                        "txHash": txHash
                    };
                    await confirmOrder(params).then((response) => {
                        console.log(response);
                        if (response.success) {
                            this.orderId = '';
                            this.$message({message: this.$t('switch.confirmOrderSuccess'), type: 'success', duration: 1000});
                        } else {
                            this.$message({message: this.$t('switch.confirmOrderError') + response.data, type: 'error', duration: 1000});
                        }
                    }).catch((err) => {
                        this.$message({message: this.$t('switch.confirmOrderError') + err, type: 'error', duration: 1000});
                    });
                }else {
                    this.$message({message: this.$t('public.errorPwd'), type: 'error', duration: 1000});
                }
            },

            /**
             * 根据地址获取可买挂单列表
             */
            getBuyListByAddress(page, rows, address) {
                let params = {
                    "current": page,
                    "pageSize": rows,
                    "address": address,
                    "fromTokenId": this.fromTokenId,
                    "toTokenId": this.toTokenId
                };
                this.$get('/v1/order/listOnSell', '', params)
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            for (let item of response.result.records) {
                                //item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                                item.price = timesDecimals(item.price, 8);
                                item.txNum = timesDecimals(item.txNum, 8);
                                item.totalNum = timesDecimals(item.totalNum, 8);
                            }
                            this.buyList = response.result.records;
                            this.buyListPager.total = response.result.total;
                            this.buyListLoading = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },

            // this.listOnSell({"pageNumber":pageNumber,"pageSize":_self.pageSize,"address":_self.address},function(res){
            //
            // }),

            /**
             * 根据地址获取可买挂单列表 分页
             */
            pagesBuyList() {
                this.getBuyListByAddress(this.buyListPager.page, this.buyListPager.rows, this.address);
            },

            /**
             * 根据地址获取可卖挂单列表
             */
            getSellListByAddress(page, rows, address) {
                let params = {
                    "current": page,
                    "pageSize": rows,
                    "address": address,
                    "fromTokenId": this.fromTokenId,
                    "toTokenId": this.toTokenId
                };
                this.$get('/v1/order/listOnBuy', '', params)
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            for (let item of response.result.records) {
                                //item.createTime = moment(getLocalTime(item.time)).format('YYYY-MM-DD HH:mm:ss');
                                item.price = timesDecimals(item.price, 8);
                                item.totalNum = timesDecimals(item.totalNum, 8);
                            }
                            this.sellList = response.result.records;
                            this.sellListPager.total = response.result.total;
                            this.sellListLoading = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },

            /**
             * 根据地址获取Token交易列表分页
             */
            pagesSellList() {
                this.getSellListByAddress(this.sellListPager.page, this.sellListPager.rows, this.address);
            },

            /**
             * 根据地址获取当前委托列表
             */
            getDepositListByAddress(page, rows, address) {
                let params = {"current": page, "pageSize": rows, "address": address};
                this.$get('/v1/order/queryMyCurrentOrder', '', params)
                    .then((response) => {
                        if (response.hasOwnProperty("result")) {
                            for (let item of response.result.records) {
                                //item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                                item.price = timesDecimals(item.price, 8);
                                item.txNum = timesDecimals(item.txNum, 8);
                                item.totalNum = timesDecimals(item.totalNum, 8);
                            }
                            this.depositList = response.result.records;
                            this.depositListPager.total = response.result.total;
                            this.depositListLoading = false;
                        }
                    }).catch((error) => {
                    console.log(error)
                })
            },
            /**
             * 根据地址获取当前委托列表 分页
             */
            pagesDepositList() {
                this.getDepositListByAddress(this.depositListPager.page, this.depositListPager.rows, this.address);
            },

            /**
             * 选择代币类型
             **/
            changeTokenType(fromTokenId, toTokenId, fromTokenSymbol, toTokenSymbol) {
                //this.$message(fromTokenId+"==="+toTokenId);
                //this.$message(fromTokenSymbol+"==="+toTokenSymbol);
                this.fromTokenId = fromTokenId;
                this.toTokenId = toTokenId;
                this.fromTokenSymbol = fromTokenSymbol;
                this.toTokenSymbol = toTokenSymbol;
            },

            /**
             * url 连接跳转
             * @param name
             * @param parmes
             */
            toUrl(name, parmes) {
                let newParmes = {};
                if (name === 'addressInfo') {
                    this.address = parmes;
                    newParmes = {address: parmes}
                } else {
                    newParmes = {hash: parmes}
                }
                this.$router.push({
                    name: name,
                    query: newParmes
                })
            },

        },

        watch: {
            address: function () {
                // address，当放生变化时，重新获取数据
                this.activeName = 'buyTab';
                //this.buyListLoading = true;
                //this.getAddressInfo(this.address);
                //this.pagesBuyList();
                //this.pagesDepositList();
                //延迟加载饼状图
                setTimeout(() => {

                }, 500);
            }
        }
    }
</script>

<style lang="less">
    @import "./../../assets/css/style";


    .el-tabs .el-tabs__header {
        margin: 0 01px;
    }

    .switch-hall {
        //min-height: 800px;
        margin-bottom: 10px;

        .bg-white {
            height: 50px;

            .title {
                padding-bottom: 0px;
                margin: 0px auto 0;

                .click {
                    margin-left: 20px;
                }

                @media screen and (max-width: 1000px) {
                    padding: 0 0 1.8rem 0.5rem;
                    font-size: 0.9rem;
                    .click {
                        margin-left: 1rem;
                        font-size: 0.9rem;
                    }
                }
            }
        }

        .top {
            margin: -2px auto 0;
            height: 255px;
            @media screen and (max-width: 1000px) {
                height: auto;
            }

            .top-left {
                margin-left: 5px;
                width: 300px;
                height: 255px;
                border: @BD1;
                border-radius: 3px;
                background-color: @Bcolour1;
                @media screen and (max-width: 1000px) {
                    width: 95%;
                    height: auto;
                }

                .tabs_title {
                    padding: 5px 0 0 0px;
                    text-align: center;
                    height: 30px;
                }

                .tabs_header {
                    background: #F5F6F8;
                    font-size: 16px;
                    font-weight: 700;
                    color: #475472;
                }
            }

            .order {
                width: 620px;
                height: 255px;
                float: left
            }

            .order_left {
                .order_row {
                    padding-top: 15px;

                    .order_label {
                        width: 60px;
                        float: left;
                        display: inline;
                        padding: 10px 0 0 5px;
                    }

                    .order_input {
                        width: 160px;
                        float: left;
                        display: inline;
                    }

                    .order_span {
                        width: 60px;
                        float: left;
                        display: inline;
                        padding: 10px 0 0 5px;
                    }
                }

                .order_btn_row {
                    padding-top: 10px;
                    text-align: center
                }
            }

            .top-right {
                width: 500px;
                height: 255px;
                border: @BD1;
                border-radius: 3px;
                background-color: @Bcolour1;
                @media screen and (max-width: 1000px) {
                    width: 95%;
                    height: auto;
                }

                .tabs_title {
                    padding: 0 0 0 30px;
                }
            }

            .top-left {
                @media screen and (max-width: 1000px) {
                    display: none;
                }
            }

            .top-right {
                margin: 0 0 0 20px;
                @media screen and (max-width: 1000px) {
                    margin: 0 0 0 2.5%;
                }

                .total_ul {
                    margin: 0 20px;

                    li {
                        border-bottom: @BD1;
                        padding: 0 10px;
                        color: @Acolor3;

                        &:last-child {
                            border-bottom: 0
                        }

                        span {
                            color: @Mcolour;
                        }

                        .click {
                            color: @Ccolour;
                        }
                    }
                }
            }
        }

        .buyToken {
            .order_row {
                padding-top: 15px;

                .order_label {
                    width: 60px;
                    float: left;
                    display: inline;
                    padding: 10px 0 0 5px;
                }

                .order_input {
                    width: 200px;
                    float: left;
                    display: inline;
                }

                .order_span {
                    width: 60px;
                    float: left;
                    display: inline;
                    padding: 10px 0 0 5px;
                }
            }
        }

        .bottoms {
            margin: 0px auto 40px;
            @media screen and (max-width: 1000px) {
                margin: 1.5rem auto 1.5rem ;
                width: 95%;
            }

            .el-deposit-table {
                margin-bottom: 15px;
            }

        }
    }

    .order-trade-dialog {
        .el-dialog {
            width: 700px;
            .el-dialog__body {
                background-color: #F5F6F9 !important;
                padding: 30px 20px 30px 20px !important;
                .el-form {
                    .el-form-item {
                        .el-form-item__label {
                            line-height: 0;
                            padding: 28px 0 20px 0;
                        }
                    }
                }
            }
            .el-dialog__footer {
                text-align: center;
                background-color: #F5F6F9 !important;
                .dialog-footer {
                    padding: 1rem 1rem 0.1rem;
                    .el-button {
                        width: 9.5rem;
                    }
                    .el-button--success {
                        span {
                            color: white;
                        }
                    }
                }
            }
        }
    }
</style>
